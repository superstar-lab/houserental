import React, { Component } from 'react';
import {Container, Sidebar, Header, Content, Footer, Icon, Loader} from 'rsuite';
import {t as message} from 'localizify';
import NotificationUtils from '../../helper/notification-utils';
import { ThemeProvider,
    Column, 
    Row, 
    Title, 
    Subtitle, 
    Avatar, 
    ChatList, 
    ChatListItem,
    MessageList,
    MessageGroup,
    Message,
    MessageText,
    MessageMedia,
    TextComposer,
    IconButton,
    TextInput,
    SendButton,
    AddIcon
 } from '@livechat/ui-kit'


import LocalStorageHelper from '../../helper/local.storage.helper';
import Helper from '../../helper/helper';
import DateTimeHelper from '../../helper/date-time.helper';
import ChatStatusHelper from '../../helper/chat-status.helper';
import './chat.style.css';

import ChatModel from '../../model/chat/chat.model';
import ChatMessageModel from '../../model/chat/chat-message.model';
import ChatMessageService from '../../service/chat/chat-message.service';

class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.helper = new Helper();
        this.chatService = new ChatMessageService();
        this.currentUser = null;
        this.hiddenFileInput = React.createRef();
        this.receivedListner = this.receivedEventListener.bind(this);
        this.state = {
            isLoadingTopic: true,
            isLoadingMessage: false,
            isRefreshing: true,
            messages: [],
            chatList: [],
            selectedTopic: null
        };
    }

    componentDidMount() {
        const currentUser = LocalStorageHelper.getCurrentUser();
        if (currentUser !== null) {
            this.currentUser = currentUser;
            this.fetchMessagesInbox(this.currentUser.id);
        }
        NotificationUtils.addOnReceivedEventListener(this.receivedListner)
    }

    receivedEventListener(message) {
        if (this.helper.isObjectNotNull(message) && this.helper.isObjectNotNull(message.id)) {
            if (this.helper.isObjectNotNull(this.state.selectedTopic) && message.topicId == this.state.selectedTopic.topicId) {
                this.assignMessagesData([message]);
            }
        }
    }

    fetchMessagesInbox() {
        this.setState({ isLoadingTopic: true });
        this.chatService.listAllChatTopicsByUserId(this.currentUser.id)
            .then(res => res.json())
            .then(this.assignChatListData)
            .catch(this.handleErrorRequest)
    }

    assignChatListData = (data) => {
        let chatList = ChatModel.fromJsonArray(data);
        chatList.sort(this.sortDescending);
        this.setState({ isLoadingTopic: false, isRefreshing: false, chatList: chatList });
    }

    handleErrorRequest = (error) => {
        console.log(error)
        this.setState({ isLoadingTopic: false, isLoadingMessage: false, isRefreshing: false });
        // Toast.show({
        //     text: "Network request failed.",
        //     type: "danger",
        //     position: "bottom",
        //     duration: 2000
        // });
        
    }

    // COMPARE FUNCTION FOR CHATLIST //
    sortDescending = (a, b) => {
        if (a.sentDate > b.sentDate) {
            return -1;
        }
        if (a.sentDate < b.sentDate) {
            return 1;
        }
        return 0
    }

    sortAscending = (a, b) => {
        if (a.sentDate > b.sentDate) {
            return 1;
        }
        if (a.sentDate < b.sentDate) {
            return -1;
        }
        return 0
    }

    getMessageDateForDispay = dateTimeStamp => {
        if (DateTimeHelper.isToday(dateTimeStamp)) {
            return DateTimeHelper.getTimeAsStringFromTimeStamp(dateTimeStamp);
        }
        return DateTimeHelper.getShortDateStringFromTimeStamp(dateTimeStamp);
    }

    getAvataLetter = (name) => {
        return name.charAt(0);
    }

    fetchChatMessageList = (topic) => {
        if (this.helper.isObjectNotNull(topic)) {
            this.setState({ isLoadingMessage: true });
            this.chatService.listAllChatMessagesByTopicId(topic.topicId)
              .then(res => res.json())
              .then(data => {
                  let messages = data;
                  messages.sort(this.sortAscending);
                  this.assignMessagesData(messages)
              })
              .catch(this.handleErrorRequest)
        }
    }

    assignMessagesData = (chatMessageDetails) => {
        this.setState({
            isLoadingMessage: false,
            messages: [...this.state.messages, ...chatMessageDetails]
        });
    }

    markMessageAsRead = (messageId, userId) => {
        this.chatService.markChatAsRead(messageId, userId);
    }
    
    markAllMessageByTopicAsRead = (topicId, userId) => {
        this.chatService.markAllAsRead(topicId, userId);
    }

    sendMessage = (messageText) => {
        const topicId = this.state.selectedTopic.topicId;
        const recipientId = this.state.selectedTopic.recipientId;
        this.chatService.sendChatMessage(new ChatMessageModel(topicId, this.currentUser.id, recipientId, messageText))
            .then(res => res.json())
            .then(message => {
                this.setState(previousState => ({
                    messages: previousState.messages.concat(message),
                }));
            });
    }

    uploadImages(file) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("topicId", this.state.selectedTopic.topicId);
        formData.append("fromUserId", this.currentUser.id);
        formData.append("recipientId", this.state.selectedTopic.recipientId);

        this.chatService.sendChatMessageWithAttachment(formData)
            .then(res => res.json())
            .then((message => {
                this.setState(previousState => ({
                    messages: previousState.messages.concat(message),
                }));
            }))
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const {chatList, selectedTopic, messages, isLoadingMessage, isLoadingTopic, messageText} = this.state;
        
        return (
            <div className="chat-container">
                <ThemeProvider>
                    <Container>
                        <Sidebar style={{overflowY: 'auto', flex: 0.5, minWidth: 300, maxWidth: 300, borderRight: '1px solid #dbdbdb'}}>
                            {
                                isLoadingTopic ?  
                                    <div style={{width: '100%', textAlign: 'center', marginTop: 50}}>
                                        <Loader size="md" content="Loading" />
                                    </div>
                                    :
                                    <ChatList style={{ maxWidth: '100%'}}>
                                        {
                                            chatList !== null && chatList !== undefined && chatList.length > 0 ?
                                                chatList.map((item, index) =>
                                                    <ChatListItem key={index}
                                                    onClick={e => {
                                                        this.setState({messages:[], selectedTopic: item})
                                                        this.fetchChatMessageList(item);
                                                        this.markAllMessageByTopicAsRead(item.topicId, item.userId);
                                                    }}
                                                    className={selectedTopic != null && selectedTopic.topicId === item.topicId ? 'topic-item topic-selected-item': 'topic-item'}>
                                                        <Avatar className='avata' letter={this.getAvataLetter(item.recipientName)} imgUrl={item.recipientProfile}/>
                                                        <Column fill= "true" style={{width: '100%'}}>
                                                            <Subtitle nowrap style={{fontSize: 12, textAlign: 'right'}}>{this.getMessageDateForDispay(item.sentDate)}</Subtitle>
                                                            <Row justify>
                                                                <Title ellipsis>
                                                                    {item.status == ChatStatusHelper.REQUEST || item.status == ChatStatusHelper.CONFIRMED ?
                                                                        <div style={{color: '#00FF00'}}>
                                                                            {item.status != null &&
                                                                                <span>{message(ChatStatusHelper.getChatStatusByCode(item.status))} - </span>
                                                                            }
                                                                            {item.recipientName}
                                                                        </div> 
                                                                        : 
                                                                        <div style={{ flexDirection:'row'}}>
                                                                            {item.status != null &&
                                                                                <span>{message(ChatStatusHelper.getChatStatusByCode(item.status))} - </span>
                                                                            }
                                                                            {item.recipientName }
                                                                        </div>
                                                                    }
                                                                </Title>
                                                                
                                                            </Row>
                                                            <Subtitle ellipsis>
                                                                <div dangerouslySetInnerHTML={{__html: item.lastMessage}} />
                                                            </Subtitle>
                                                        </Column>
                                                    </ChatListItem>
                                                )
                                            : <div style={{textAlign: 'center', marginTop: 20}}>No conversation yet</div>
                                        }
                                    </ChatList>
                            }
                            
                        </Sidebar>
                        <Container>
                            <Header style={{textAlign: 'center', paddingTop: 10, paddingBottom: 10}}>
                                {
                                    this.helper.isObjectNotNull(selectedTopic)
                                        ? selectedTopic.recipientName
                                        : ''
                                }
                            </Header>
                            <Content style={{overflowY: 'auto', width: '100%'}}>
                                <div style={{height: '100%' }}>
                                    {isLoadingMessage ?  
                                        <div style={{width: '100%', textAlign: 'center'}}>
                                            <Loader size="md" content="Loading" />
                                        </div>
                                        :
                                        <MessageList active>
                                            {
                                                messages.map((message, index) => 
                                                    <MessageGroup 
                                                        onlyFirstWithMeta
                                                        key={index}
                                                        avatar={message.profileImage}>
                                                        <Message 
                                                            date={this.getMessageDateForDispay(message.sentDate)} 
                                                            isOwn={this.currentUser.id === message.fromUserId} 
                                                            authorName={message.fromUserName}>
                                                            <MessageText className={this.currentUser.id === message.fromUserId ? 'user-message' : 'recipient-message'}>
                                                                {
                                                                    this.helper.isObjectNotNull(message.attachmentUrl) &&
                                                                        <MessageMedia>
                                                                            <img style={{width: '100%', maxWidth: 400}} src={message.attachmentUrl} />
                                                                        </MessageMedia>
                                                                }
                                                                {
                                                                    !this.helper.isObjectNotNull(message.attachmentUrl) &&
                                                                        <div dangerouslySetInnerHTML={{__html: message.message}} />
                                                                }
                                                            </MessageText>
                                                        </Message>
                                                    </MessageGroup>
                                                )
                                            }
                                        </MessageList>
                                    }
                                </div>
                            </Content>
                            <Footer>
                                { this.helper.isObjectNotNull(selectedTopic) &&
                                    <TextComposer defaultValue=""
                                        onSend = {value => {
                                            this.sendMessage(value);
                                        }}>
                                        <Row align="center">
                                            <IconButton fit>
                                                <AddIcon onClick={e => this.hiddenFileInput.current.click()}/>
                                                <input type="file" accept="image/*" style={{display: 'none'}}
                                                    ref={this.hiddenFileInput}
                                                    onChange={e => {
                                                        this.uploadImages(e.target.files[0])
                                                    }}/>
                                            </IconButton>
                                            <TextInput fill='true'/>
                                            <SendButton fit />
                                        </Row>
                                    </TextComposer>
                                }
                            </Footer>
                        </Container>
                    </Container>
                </ThemeProvider>
            </div>
        );
    }
}

export default ChatPage;