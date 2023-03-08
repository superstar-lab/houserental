import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  DeviceEventEmitter,
} from "react-native";
import {
  Header,
  Title,
  Container,
  ListItem,
  Left,
  Body,
  Toast,
  Tabs,
  ScrollableTab,
  Tab,
  TabHeading,
  Item,
  Input,
} from "native-base";
import { withNavigation } from "react-navigation";
import theme from "../theme/theme";
import GotoLogin from "../../component/goto-login.component";
import DateTimeHelper from "../../helper/date-time.helper";
import Helper from "../../helper/helper";
import NotificationUtils from "../../helper/notification-utils";
import ChatModel from "../../api/model/chat/chat.model";
import ChatStatusHelper from "../../helper/chat-status.helper";
import customTextStyleHelper from "../../helper/custom-text-style.helper";
import { message } from "../../I18n/i18n";
import HTML from "react-native-render-html";
import DeviceEventEmitterNameHelper from "../../helper/device-event-emitter-name.helper";
import FontAwesomePro, { Icons } from "react-native-fonts-awesomepro";
import AnalyticsHelper from "../../helper/analytics.helper";
import ContractHelper from "../../helper/contract.helper";
import AssetReservationHelper from "../../helper/asset-reservation.helper";
import moment from "moment-timezone";
import AssetInventoryHelper from "../../helper/inventory/asset-inventory.helper";
import { BOTTOM_MENU_MESSAGE_INDEX } from "../../helper/navigation.helper";
var _ = require('lodash');
const deviceTimeZone = moment.tz.guess();

class ChatListScreen extends Component {
  constructor() {
    super();
    this.state = {
      secUserId: null,
      isFirstLoad: true,
      isLoading: true,
      isLoadingStorage: true,
      isLoadingMoreData: false,
      isListEnd: false,
      isRefreshing: false,
      selectedItem: null,
      chatList: [],
      defaultImage: require("../../assets/rentals/icons/default-profile/moien-pale-blue.png"),
      activeTab: 0,
      searchText: '',
      searchListChat: [],
    };
    this.offset = 0;
    this.limit = 20;

    this.searchText = '';
  }

  componentDidMount() {
    this.getUserIdAndLoadChatMessagesByTopic();
    this.addDidFocusListener();
  }
  componentWillUnmount() {
    this._navListener.remove();
  }

  addDidFocusListener() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      this.chatModel = this.props.navigation.getParam("chatModel");
      AnalyticsHelper.sendAnalytic(AnalyticsHelper.BANNER_CHAT);
      if (Helper.isObjectNotNull(this.chatModel) && this.state.isFirstLoad) {
        var chatMessage = new ChatModel();
        chatMessage.topicId = this.chatModel.topicId;
        chatMessage.userId = this.chatModel.recipientId;
        chatMessage.userName = this.chatModel.recipientName;
        chatMessage.recipientId = this.chatModel.fromUserId;
        chatMessage.recipientName = this.chatModel.fromUserName;
        chatMessage.status = this.chatModel.status;
        chatMessage.category = this.chatModel.category;
        chatMessage.chatType = this.chatModel.chatType;
        chatMessage.assetId = this.chatModel.assetId;
        chatMessage.appointmentId = this.chatModel.appointmentId;
        chatMessage.contractId = this.chatModel.contractId;
        chatMessage.reservationId = this.chatModel.reservationId;
        chatMessage.lastChatTypeMessageId = this.chatModel.lastChatTypeMessageId;
        chatMessage.contractSubletId = this.chatModel.contractSubletId;

        this.props.navigation.navigate('Chat', {
          chatMessage: chatMessage
        });
      }

      if (this.state.isFirstLoad) {
        this.setState({ isFirstLoad: false });
        return;
      }
      this.markChatMessageAsReadIfSelected();
      this.offset = 0;
      this.setState({ isLoading: true, chatList: [], isListEnd: false, searchListChat: [] });
      this.getUserIdAndLoadChatMessagesByTopic();
    });
  }

  getStatusForDispay = (item) => {
    var statusAndDateStr = Helper.EMPTY;
    var statusStr = Helper.EMPTY;
    var dateAndTimeStr = Helper.EMPTY;
    var wkfStatusId = Helper.EMPTY;
    if (Helper.isObjectNotNull(item.wkfStatus)) {
      wkfStatusId = item.wkfStatus.id;
      statusStr = Helper.getDesc(item.wkfStatus);
    } else {
      statusStr = message(ChatStatusHelper.getChatStatusByCode(item.status));
    }

    if (Helper.isObjectNotNull(item.appointmentDate)
      && Boolean(Helper.REQ_PENDDING_ID == wkfStatusId
        || Helper.REQ_ACCEPTED_ID == wkfStatusId
        || Helper.REQ_UPDATED_ID == wkfStatusId
        || Helper.REQ_VISITOR_UPDATED_ID == wkfStatusId
        || Helper.REQ_INV_PENDDING_ID == wkfStatusId
        || Helper.REQ_INV_ACCEPTED_ID == wkfStatusId
        || Helper.REQ_INV_UPDATED_ID == wkfStatusId
        || Helper.REQ_INV_VISITOR_UPDATED_ID == wkfStatusId)) {

      dateAndTimeStr = DateTimeHelper.getDateAndMonth(moment(item.appointmentDate)
        .format(Helper.FORMAT_YYYYMMDD_MINUS)) + " " + item.timeStartHourStr;
      statusAndDateStr = statusStr + " - " + dateAndTimeStr;
    } else if (Boolean(ContractHelper.CONTRACT_ACTIVATED_ID == wkfStatusId
        || AssetInventoryHelper.INVENTORY_ACTIVATED_ID == wkfStatusId)) {
      statusAndDateStr = statusStr + " - " +
        DateTimeHelper.getDateAndMonth(moment(item.contractStartDateStr)
          .format(Helper.FORMAT_YYYYMMDD_MINUS));
    } else if ((AssetReservationHelper.RESERVATION_PENDING_ID == wkfStatusId
        || AssetReservationHelper.RESERVATION_ACCEPTED_ID == wkfStatusId)
      && Helper.isObjectNotNull(item.reservationStartDate)
      && Helper.isObjectNotNull(item.reservationEndDate)) {

      dateAndTimeStr = DateTimeHelper.getDateAndMonth(moment(item.reservationStartDate)
        .format(Helper.FORMAT_YYYYMMDD_MINUS))
        + " - " + DateTimeHelper.getDateAndMonth(moment(item.reservationEndDate).add(1, 'days')
          .format(Helper.FORMAT_YYYYMMDD_MINUS));
      statusAndDateStr = statusStr + " - " + dateAndTimeStr;
    } else {
      statusAndDateStr = statusStr;
    }

    return statusAndDateStr;
  }

  getMessageDateForDispay = (dateTimeStamp) => {
    if (DateTimeHelper.isToday(dateTimeStamp)) {
      return DateTimeHelper.formatTimeStampToString(dateTimeStamp, DateTimeHelper.FORMAT_HH_MM_DOT);
    } else if (DateTimeHelper.isYesterday(dateTimeStamp)) {
      return message('hou.ren.yesterday');
    } else if (DateTimeHelper.isThisYear(dateTimeStamp)) {
      return DateTimeHelper.getDateAndMonth(dateTimeStamp);
    }
    return DateTimeHelper.formatTimeStampToString(dateTimeStamp, DateTimeHelper.FORMAT_DDMMYYYY_SLASH);
  };

  getUserIdAndLoadChatMessagesByTopic = () => {
    const userLocalStorage = AsyncStorage.getItem(Helper.USER_KEY);
    if (userLocalStorage == null) {
      this.setState({
        isLoading: false,
        isLoadingStorage: false,
      });
      return;
    }
    userLocalStorage.then((value) => {
      let userObject = JSON.parse(value);
      this.setState({
        isLoadingStorage: false,
        secUserId: userObject !== null ? userObject.id : null,
      });
      if (this.state.secUserId != null) {
        DeviceEventEmitter.emit(DeviceEventEmitterNameHelper.LOGIN_EVENT_NAME, {});
        NotificationUtils.registerNotificationForUser(this.state.secUserId);
        this.fetchMessagesInbox(this.state.secUserId);
      }
    });
  };

  markChatMessageAsReadIfSelected = () => {
    if (
      this.state.selectedItem == null ||
      this.state.selectedItem.unreadCount == 0
    ) {
      this.setState({ selectedItem: null });
      return;
    }
    this.state.selectedItem.unreadCount = 0;
    this.setState({ selectedItem: null });
  };

  fetchMessagesInbox = () => {
    if (this.state.isLoading && this.state.chatList.length > 0) {
      return;
    }

    if (!this.state.isLoadingMoreData && !this.state.isListEnd) {
      this.setState({ isLoadingMoreData: true });
      if (this.state.activeTab == 0) {
        Helper.CHAT_MESSAGE_SERVICE.listAllChatTopicsByUserId(this.state.secUserId, deviceTimeZone, this.offset, this.limit)
          .then((res) => res.json())
          .then(this.assignChatListData)
          .catch(this.handleErrorRequest);
      } else if (this.state.activeTab == 1) {
        Helper.CHAT_MESSAGE_SERVICE.listAppointmentChatGroupWithLastMessage(this.state.secUserId, deviceTimeZone, this.offset, this.limit)
          .then((res) => res.json())
          .then(this.assignChatListData)
          .catch(this.handleErrorRequest);
      } else if (this.state.activeTab == 2) {
        Helper.CHAT_MESSAGE_SERVICE.listReservationChatGroupWithLastMessage(this.state.secUserId, deviceTimeZone, this.offset, this.limit)
          .then((res) => res.json())
          .then(this.assignChatListData)
          .catch(this.handleErrorRequest);
      } else if (this.state.activeTab == 3) {
        Helper.CHAT_MESSAGE_SERVICE.listUnreadChatGroupWithLastMessage(this.state.secUserId, deviceTimeZone, this.offset, this.limit)
          .then((res) => res.json())
          .then(this.assignChatListData)
          .catch(this.handleErrorRequest);
      }
    } else {
      this.setState({ isLoading: false, isRefreshing: false, isLoadingMoreData: false });
    }
  };

  handleErrorRequest = (error) => {
    this.setState({ isLoading: false, isRefreshing: false, isLoadingMoreData: false });
    Toast.show({
      text: "Network request failed.",
      type: "danger",
      position: "bottom",
      duration: 2000,
    });
  };

  assignChatListData = (data) => {
    var listChat = ChatModel.fromJsonArray(data);

    if (listChat.length > 0) {
      this.offset = this.offset + 20;
      this.setState({
        isLoadingMoreData: false, isLoading: false, isRefreshing: false,
        chatList: [...this.state.chatList, ...listChat],
        searchListChat: [...this.state.searchListChat, ...listChat]
      });
    } else {
      this.setState({
        isLoading: false,
        isRefreshing: false,
        isLoadingMoreData: false,
        isListEnd: true,
      });
    }

  };

  // COMPARE FUNCTION FOR CHATLIST //
  compare = (a, b) => {
    if (a.sentDate > b.sentDate) {
      return -1;
    }
    if (a.sentDate < b.sentDate) {
      return 1;
    }
    return 0;
  };

  onChangeTab(i) {
    this.offset = 0;
    this.setState({
      activeTab: i,
      chatList: [],
      searchListChat: [],
      isLoadingMoreData: false,
      isListEnd: false
    }, () => {
      this.setState({ isLoading: true })
      this.fetchMessagesInbox()
    })
  }

  onRefresh() {
    this.offset = 0;
    this.setState({
      chatList: [],
      searchListChat: [],
      isListEnd: false,
      isRefreshing: true,
      isLoadingMoreData: false,
      isLoading: true
    }, () => {
      this.fetchMessagesInbox();
    });
  }

  navigateToChatDetailScreen = (item) => {
    this.setState({ selectedItem: item });
    this.props.navigation.navigate("Chat", {
      chatMessage: item,
    });
  };

  onFetchImageError = (error) => {
    //console.log('onFetchImageError => ', error);
  };

  headerView = () => {
    return (
      <View style={styles.headerStyle}>
        <Text style={styles.headerTitle}>{message("hou.ren.inbox")}</Text>
      </View>
    );
  };

  getTextMessage(message, unread) {
    if (Helper.isObjectNotNull(message) && message != Helper.EMPTY) {
      message = message.trim();
    }
    if (
      /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
        message
      )
    ) {
      return (
        <View>
          <HTML
            html={message}
            tagsStyles={{
              p: customTextStyleHelper.TEXT_CAPTION_STYLE,
              fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6
            }}
          />
        </View>
      );
    }
    return (
      <Text
        style={unread ? [
          customTextStyleHelper.TEXT_CAPTION_STYLE,
          {
            color: theme.FONT_COLOR_TEXT_TITLE, fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
            lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
            fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6
          },
        ] :
          [customTextStyleHelper.TEXT_CAPTION_STYLE, {
            lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
            fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6
          }]
        }
        numberOfLines={1}
        ellipsizeMode={"tail"}
      >
        {message}
      </Text>
    );
  }

  getProfileName(name) {
    let lastName = "";
    let firstName = "";
    lastName = name?.substr(-2, 1);
    firstName = name?.substr(0, 1);
    return lastName + firstName;
  }

  renderEmptyList() {
    return (
      <View style={styles.activityIndicator}>
        <Title
          style={{
            textAlign: "center",
            fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
            fontSize: theme.FONT_SIZE_H4,
            color: theme.FONT_COLOR_TEXT_TITLE,
          }}
        >
          {message("hou.ren.emptyList")}
        </Title>
      </View>
    );
  }

  searchBarDebounce = _.debounce((text) => {
    this.filterMessage(text);
  }, 1000)

  renderSearchBar() {
    return (
      <Item rounded style={{
        borderRadius: 6, borderColor: 'rgba(202,202,216,0.5)', paddingHorizontal: 5,
        height: Helper.getVerticalScale(47), backgroundColor: theme.WHITE
      }}>
        <FontAwesomePro
          style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID, padding: 10 }}
          size={Helper.getVerticalScale(16)}
          color={theme.FONT_COLOR_LINK}
          icon={Icons.search}
        />
        <Input placeholder={message("hou.ren.searchInbox")}
          value={this.state.searchText}
          placeholderTextColor={theme.FONT_COLOR_TEXT_TITLE_2}
          onFocus={(e) => { }}
          onChangeText={(text) => {
            this.setState({ searchText: text })
            this.searchBarDebounce(text);
          }
          }
          style={{
            fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H5, marginLeft: -8,
            fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
          }} />
      </Item>
    )
  }

  filterMessage(text) {
    this.setState({ isListEnd: true, })
    const listChat = this.state.searchListChat;

    if (Helper.isObjectNotNull(this.state.activeTab)) {
      this.state.chatList = listChat.filter((item) => {
        var info = getInfo(item);
        return info.includes(text.toLocaleLowerCase());
      });
      this.setState({});
    }

    function getInfo(item) {
      var info = item.assetTitle + " " +
        message(ChatStatusHelper.getChatStatusByCode(item.status)) + " " +
        item.recipientName + " " +
        item.fromUserName + " " +
        item.lastMessage;
      info = info.toLocaleLowerCase()
      return info;
    }
  }

  renderFooter = () => {
    return (
      <View >
        {Boolean(this.state.isLoadingMoreData) ? (
          <ActivityIndicator color={theme.FONT_COLOR_LINK} size={'small'} />
        ) : null}
      </View>
    );
  }

  renderListMessages(index) {

    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: 10,
          backgroundColor: theme.OFF_WHITE,
        }}
      >
        <View style={{
          paddingHorizontal: 16, paddingTop: 16,
          marginBottom: Helper.isIOSPlatform() ? 4 : 0
        }}>
          {
            this.renderSearchBar()
          }
        </View>
        {
          this.state.isLoading ||
            (this.state.secUserId == null && this.state.isLoadingStorage) ? (

            <View style={styles.activityIndicator}>
              <ActivityIndicator
                animating={this.state.isLoading}
                color={theme.FONT_COLOR_LINK}
                size="small"
              />
            </View>
          ) : Boolean((!this.state.isLoadingMoreData && !this.state.isLoading) && this.state.chatList.length == 0) ? (
            this.renderEmptyList()
          ) : (
            <FlatList
              style={{ flex: 1, paddingLeft: -16, paddingRight: 16, marginTop: Helper.getVerticalScale(5) }}
              data={Boolean(Helper.isObjectNotNull(this.state.chatList) && this.state.chatList.length > 0) ?
                this.state.chatList.sort(this.compare) : []}
              initialNumToRender={5}
              onEndReachedThreshold={0.5}
              onRefresh={this.onRefresh.bind(this)}
              refreshing={this.state.isRefreshing}
              onEndReached={Boolean(!this.state.isLoadingMoreData) && this.fetchMessagesInbox.bind(this)}
              ListFooterComponent={this.renderFooter.bind(this)}
              // ListHeaderComponent={this.headerView}
              renderItem={({ item }) => (
                <ListItem
                  // avatar
                  onPress={() => {
                    this.offset = 0;
                    this.setState({ isLoadingMoreData: false, isListEnd: false });
                    this.navigateToChatDetailScreen(item);
                  }}
                  style={{ height: Helper.getVerticalScale(75), borderBottomWidth: 0, paddingRight: 0 }}
                >
                  <Left style={{ flex: 0.23 }}>
                    {Boolean(
                      item.recipientProfile == Helper.EMPTY ||
                      item.recipientProfile == null
                    ) ? (
                      <View
                        style={[
                          styles.itemImage,
                          {
                            justifyContent: "center"
                          },
                        ]}
                      >
                        <Text
                          style={[
                            customTextStyleHelper.TITLE_TEXT_H3_STYLE,
                            {
                              fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                              color: theme.FONT_COLOR_TEXT_TITLE,
                              textAlign: "center",
                              alignSelf: "center",
                              paddingTop: Helper.isIOSPlatform() ? 4 : 0,
                            },
                          ]}
                        >
                          {this.getProfileName(item.recipientName)}
                        </Text>
                      </View>
                    ) : (
                      <Image
                        style={styles.itemImage}
                        source={{ uri: item.getSenderImage() }}
                        defaultSource={this.state.defaultImage}
                        onError={this.onFetchImageError.bind(this)}
                      />
                    )}
                  </Left>
                  <Body style={{ flex: 0.97 }}>
                    <View>
                      {(
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text
                            numberOfLines={1}
                            style={[
                              customTextStyleHelper.TEXT_CAPTION_STYLE,
                              {
                                flex: 0.71, fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6,
                                lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
                                color: theme.FONT_COLOR_LINK, fontFamily: theme.FONT_NAME_OVERPASS_BOLD
                              },
                            ]}
                          >
                            {this.getStatusForDispay(item)}
                          </Text>
                          <Text
                            style={[
                              customTextStyleHelper.TEXT_CAPTION_STYLE,
                              {
                                lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
                                flex: 0.29, textAlign: "right", fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6,
                                fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
                                color: theme.FONT_COLOR_TEXT_TITLE_2,
                              },
                            ]}
                          >
                            {this.getMessageDateForDispay(item.sentDate)}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={
                          Boolean(item.unreadCount > 0) ?
                            [
                              customTextStyleHelper.TEXT_CAPTION_STYLE,
                              {
                                lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
                                color: theme.FONT_COLOR_TEXT_TITLE,
                                fontFamily: theme.FONT_NAME_OVERPASS_LIGHT,
                                fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6
                              },
                            ]
                            :
                            [
                              customTextStyleHelper.TEXT_CAPTION_STYLE,
                              {
                                lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
                                color: theme.FONT_COLOR_TEXT_TITLE,
                                fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H6
                              },
                            ]
                        }
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                      >
                        {item.recipientName}
                      </Text>
                    </View>
                    {this.getTextMessage(item.lastMessage, item.unreadCount > 0 ? true : false)}
                    <View>
                      <Text
                        style={[
                          customTextStyleHelper.TITLE_TEXT_H5_STYLE,
                          {
                            lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(15),
                            color: theme.FONT_COLOR_TEXT_BODY,
                            fontSize: Helper.getFontSizeScale(11)
                          },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                      >
                        {item.assetTitle}
                      </Text>
                    </View>
                  </Body>
                </ListItem>
              )}
              ItemSeparatorComponent={() => (
                <View style={[customTextStyleHelper.LINE_SEPARATOR_STYLE, {
                  width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(55), alignSelf: 'flex-end',
                  marginTop: Helper.getVerticalScale(Helper.isIOSPlatform() ? 0 : 2.5)
                }]} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )
        }
      </SafeAreaView>
    )
  }

  render() {
    if (this.state.secUserId == null && !this.state.isLoadingStorage) {
      return <GotoLogin title={message("hou.ren.inbox")} menuIndex={BOTTOM_MENU_MESSAGE_INDEX} />;
    }
    return (
      <Container>
        <Header hasTabs style={styles.header}>
          <Body style={{ alignItems: "center" }}>
            <Title
              style={{
                textAlign: "center",
                fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
                fontSize: theme.FONT_SIZE_H2,
                color: theme.FONT_COLOR_TEXT_TITLE,
              }}
            >
              {message("hou.ren.inbox")}
            </Title>
          </Body>
        </Header>
        <Tabs
          initialPage={0}
          onChangeTab={(i) => { this.onChangeTab(i.i) }}
          style={{ backgroundColor: theme.WHITE }}
          tabBarUnderlineStyle={{ backgroundColor: theme.FONT_COLOR_LINK, height: Helper.getVerticalScale(6) }}
          renderTabBar={() => {
            return (
              <ScrollableTab style={{
                marginHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.SECONDARY_BG_COLOR
              }} />
            )
          }
          }
        >
          <Tab heading={
            <TabHeading style={[styles.activeTabStyle, { justifyContent: 'flex-start' }]}>
              <View style={Boolean(this.state.activeTab == 0) ? styles.textActiveWrap : styles.textWrap}>
                <Text style={Boolean(this.state.activeTab == 0) ? styles.activeTextStyle : styles.textStyle}>
                  {
                    message("hou.ren.all")
                  }
                </Text>
              </View>
            </TabHeading>
          }
          >
            {
              this.state.activeTab == 0 && this.renderListMessages(0)
            }
          </Tab>
          <Tab heading={
            <TabHeading style={[styles.activeTabStyle, { justifyContent: 'flex-start' }]}>
              <View style={Boolean(this.state.activeTab == 1) ? styles.textActiveWrap : styles.textWrap}>
                <Text style={Boolean(this.state.activeTab == 1) ? styles.activeTextStyle : styles.textStyle}>
                  {
                    message("hou.ren.account.pendingrequests")
                  }
                </Text>
              </View>
            </TabHeading>
          }>
            {
              this.state.activeTab == 1 && this.renderListMessages(1)
            }
          </Tab>
          <Tab heading={
            <TabHeading style={[styles.activeTabStyle, { justifyContent: 'flex-start' }]}>
              <View style={Boolean(this.state.activeTab == 2) ? styles.textActiveWrap : styles.textWrap}>
                <Text style={Boolean(this.state.activeTab == 2) ? styles.activeTextStyle : styles.textStyle}>
                  {
                    message("hou.ren.chat.tabs.reservations")
                  }
                </Text>
              </View>
            </TabHeading>
          }>
            {
              this.state.activeTab == 2 && this.renderListMessages(2)
            }
          </Tab>
          <Tab heading={
            <TabHeading style={[styles.activeTabStyle, { justifyContent: 'flex-start' }]}>
              <View style={Boolean(this.state.activeTab == 3) ? styles.textActiveWrap : styles.textWrap}>
                <Text style={Boolean(this.state.activeTab == 3) ? styles.activeTextStyle : styles.textStyle}>
                  {
                    message("hou.ren.chat.tabs.unread")
                  }
                </Text>
              </View>
            </TabHeading>
          }>
            {
              this.state.activeTab == 3 && this.renderListMessages(3)
            }
          </Tab>
        </Tabs>
        {/* <View
          style={{
            backgroundColor: theme.OFF_WHITE,
            alignItems: "flex-end",
            paddingHorizontal: 10,
          }}
        >
          <Text>48</Text>
        </View> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    flex: 1,
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  header: {
    backgroundColor: theme.WHITE,
    borderBottomWidth: 0,
    marginTop: Helper.isIOSPlatform() ? 19 : 0,
  },
  headerTitle: {
    fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H2,
    fontWeight: "bold",
    color: theme.BLACK,
    fontFamily: theme.FONT_NAME,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  item: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
  },
  itemImage: {
    width: Helper.getHorizontalScale(50),
    height: Helper.getHorizontalScale(50),
    borderRadius: Helper.getHorizontalScale(50),
    backgroundColor: theme.SECONDARY_COLOR_ILLUSTRATION_3,
  },
  separator: {
    height: 0.5,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  dateText: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    fontSize: 12,
    color: theme.FOGGY,
    fontFamily: theme.FONT_NAME,
  },
  activityIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.9,
    justifyContent: "center",
  },
  textActiveWrap: {
    flexWrap: 'wrap',
  },
  textWrap: {
    flexWrap: 'wrap',
  },
  activeTextStyle: {
    color: theme.FONT_COLOR_TEXT_BODY,
    fontSize: theme.FONT_SIZE_H4,
    fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
    paddingTop: Helper.getVerticalScale(5),
    paddingBottom: Helper.getVerticalScale(Helper.isIphone5ScreenWidth() ? 12.5 : Helper.isIOSPlatform() ? 7.5 : 10),
    textAlign: 'center'
  },
  textStyle: {
    color: theme.BORDER_COLOR,
    fontSize: theme.FONT_SIZE_H4,
    fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
    paddingTop: Helper.getVerticalScale(5),
    paddingBottom: Helper.getVerticalScale(Helper.isIphone5ScreenWidth() ? 12.5 : Helper.isIOSPlatform() ? 7.5 : 10),
    textAlign: 'center'
  },
  activeTabStyle: {
    backgroundColor: theme.WHITE,
  }
});

export default withNavigation(ChatListScreen);
