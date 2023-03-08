import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { withNavigation } from 'react-navigation';
import { StyleSheet, ActivityIndicator, View, SafeAreaView, Platform, DeviceEventEmitter, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, Text, Toast } from 'native-base';
import { renderInputToolbar, renderComposer, renderActions, renderSendButton, renderCurrentUserBubble, renderScrollToBottomComponent, renderMessageText, renderMessage } from './chat-custom-view';
import theme from '../theme/theme';
import ChatDetailsModel from "../../api/model/chat/chat-details.model";
import ChatMessageModel from "../../api/model/message/chat-message.model";
import GiftedChatUserModel from "../../api/model/chat/gifted-chat-user.model";
import GiftedChatModel from "../../api/model/chat/gifted-chat.model";
import Helper from "../../helper/helper";
import NotificationUtils from "../../helper/notification-utils";
import ImagePicker from 'react-native-image-picker';
import { message } from '../../I18n/i18n';
import DeviceEventEmitterNameHelper from '../../helper/device-event-emitter-name.helper';
import CustomHeaderLeftRightTextComponent from '../../component/custom-header-left-right-text.component';
import customTextStyleHelper from '../../helper/custom-text-style.helper';
import ChatHeader from './chat-header.component';
import ClaimBox from './claim.component';
import moment from "moment-timezone";
import FontAwesomePro, { Icons } from 'react-native-fonts-awesomepro';
import ChatStatusHelper from '../../helper/chat-status.helper';
import DateTimeHelper from '../../helper/date-time.helper';
import AssetInventoryHelper from '../../helper/inventory/asset-inventory.helper';
import CustomDialogComponent from '../../component/custom-dialog.component';
import MoienGreenProgramModal from '../accounts/moien/green-program.modal';

const deviceTimeZone = moment.tz.guess();

class ChatScreen extends Component {

  _isMounted = false;
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.chatMessage = navigation.getParam('chatMessage');
    this.topicId = this.chatMessage.topicId;
    this.lastChatTypeMessageId = this.chatMessage.lastChatTypeMessageId;
    this.currentChatUser = new GiftedChatUserModel(this.chatMessage.userId, this.chatMessage.userName, this.chatMessage.userProfile);

    this.state = {
      originalMessages: [],
      messages: [],
      isLoading: true,
      currentText: '',
      file: {},
      loadingImage: false,
      isShowGreenProgramDialog: false,
      isShowConfirmInventoryCancelDialog: false
    }
  }

  async componentDidMount() {
    this.greenProgramChatMessageId = Helper.EMPTY;
    this.chatHeaderObj = {
      imageUrl: null,
      title: Helper.EMPTY,
      address: Helper.EMPTY,
      detail: Helper.EMPTY,
    }
    this.isOwner = false;
    this.lastStatusId = null;
    this.inventoryId = null;
    this.isShowFooter = true;
    this.contractSubletId = this.chatMessage.contractSubletId;
    if (Helper.isObjectNotNull(this.chatMessage.appointmentId)) {
      await Helper.ASSET_BOOKING_RENTAL_TASK_SERVICE.getAssetBookingRentalTaskByAppointmentId(this.chatMessage.appointmentId, deviceTimeZone)
        .then(res => res.json())
        .then((data) => {
          if (Helper.isObjectHasProperty(data, "appointmentId")) {
            this.isShowFooter = false;
            this.lastStatusId = data.wkfStatus.id;
            this.inventoryId = data.inventoryId;
            this.isOwner = Boolean(this.currentChatUser._id == data.landlordSecUserId);

            if (Helper.isObjectNotNull(data.listImagesUrl) && data.listImagesUrl.length > 0) {
              this.chatHeaderObj.imageUrl = data.listImagesUrl[0];
            }
            this.chatHeaderObj.title = data.assetTitle;
            this.chatHeaderObj.address = Helper.getAddressDetailStr(data.address, Helper.getDisplayOptionAddressId(data))
            if (Helper.isObjectNotNull(this.chatMessage.category) &&
              ChatStatusHelper.CATEGORY_INVENTORY_CODE == this.chatMessage.category) {
              var cotraStartDateStr = message('hou.ren.eventtype.lease.signed') + " - "
                + DateTimeHelper.getDateAndMonth(moment(data.contractStartDateStr).format(Helper.FORMAT_YYYYMMDD_MINUS));
              this.chatHeaderObj.detail = cotraStartDateStr;
            } else if (Helper.REQ_OWNER_SCHEDULER_ID != this.lastStatusId) {
              var date = moment(moment(new Date(data.startDate)).format("YYYY-MM-DD"), "YYYY-MM-DD");
              var visitDate = date.format("DD") + Helper.SPACE +
                message("hou.ren.calendar.month." + date.format("MMM").toLowerCase()).toLowerCase().slice(0, 3) +
                Helper.SPACE + date.format("YYYY")
              this.chatHeaderObj.detail = message('hou.ren.asof') + Helper.SPACE + visitDate;
            }
          }
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({ isLoading: false });
        })
    } else if (Helper.isObjectNotNull(this.chatMessage.reservationId)) {
      await Helper.ASSET_BOOKING_RENTAL_TASK_SERVICE.getAssetBookingRentalTaskByReservationId(this.chatMessage.reservationId, deviceTimeZone)
        .then(res => res.json())
        .then((data) => {
          if (Helper.isObjectHasProperty(data, "reservationId")) {
            this.isShowFooter = false;
            this.lastStatusId = data.wkfStatus.id;
            this.isOwner = Boolean(this.currentChatUser._id == data.landlordSecUserId);

            if (Helper.isObjectNotNull(data.listImagesUrl) && data.listImagesUrl.length > 0) {
              this.chatHeaderObj.imageUrl = data.listImagesUrl[0];
            }
            this.chatHeaderObj.title = data.assetTitle;
            this.chatHeaderObj.address = Helper.getAddressDetailStr(data.address, Helper.getDisplayOptionAddressId(data))

            var startDate = moment(moment(new Date(data.startDate)).format("YYYY-MM-DD"), "YYYY-MM-DD");
            var endDate = new Date(data.endDate);
            endDate.setDate(endDate.getDate() + 1);
            var bookingStartDate = startDate.format("DD") + Helper.SPACE +
              message("hou.ren.calendar.month." + startDate.format("MMM").toLowerCase()).
                toLowerCase().slice(0, 3) + ".";

            var bookingEndDate =
              moment(moment(endDate).format("YYYY-MM-DD"), "YYYY-MM-DD").format(
                "DD"
              ) + Helper.SPACE +
              message(
                "hou.ren.calendar.month." +
                moment(moment(endDate).format("YYYY-MM-DD"), "YYYY-MM-DD")
                  .format("MMM")
                  .toLowerCase()
              ).toLowerCase().slice(0, 3) + ".";

            let nbAdults = data.nbAdults;
            let nbChildren = data.nbChildren;
            let nbTraveller = 0;
            if (Boolean(!isNaN(nbAdults))) {
              nbTraveller = parseInt(nbAdults);
              if (!isNaN(nbChildren)) {
                nbTraveller += parseInt(nbChildren);
              }
            }

            let visitDate = Helper.EMPTY;
            if (Boolean(moment(startDate).format(Helper.FORMAT_YYYYMMDD_MINUS) == moment(endDate).format(Helper.FORMAT_YYYYMMDD_MINUS))) {
              visitDate = bookingStartDate;
            } else {
              visitDate = bookingStartDate + " - " + bookingEndDate;
            }
            this.chatHeaderObj.detail = visitDate + Helper.SPACE + nbTraveller + Helper.SPACE +
              message(Helper.getNbTraveller(nbTraveller)).toLowerCase();
          }
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({ isLoading: false });
        })
    } else if (Helper.isObjectNotNull(this.contractSubletId)) {
      await Helper.ASSET_SUBLETTING_SERVICE.getContractSublettingById(this.contractSubletId)
        .then(res => res.json())
        .then((data) => {
          this.isShowFooter = false;
          this.lastStatusId = data.wkfStatus.id;
          this.isOwner = Boolean(this.currentChatUser._id == data.landlordSecUserId);
          if (Helper.isObjectNotNull(data.listImagesUrl) && data.listImagesUrl.length > 0) {
            this.chatHeaderObj.imageUrl = data.listImagesUrl[0];
          }
          this.chatHeaderObj.title = data.assetTitle;
          this.chatHeaderObj.address = Helper.getAddressDetailStr(data.address, Helper.getDisplayOptionAddressId(data))
          this.chatHeaderObj.detail = message('hou.ren.contracts.sublettingcontract');
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({ isLoading: false });
        })
    } else if (Helper.isObjectNotNull(this.chatMessage.assetId)) {
      const isSublet = Boolean(ChatStatusHelper.CATEGORY_SUBLET_CODE === this.chatMessage.category);
      this.isShowFooter = !isSublet;
      if (isSublet) {
        this.chatHeaderObj.detail = message('hou.ren.contracts.sublettingcontract');
      }
      await Helper.REA_ASSET_SERVICE.getReaAssetById(this.chatMessage.assetId)
        .then(res => res.json())
        .then((data) => {
          if (Helper.isObjectNotNull(data.listImagesUrl) && data.listImagesUrl.length > 0) {
            this.chatHeaderObj.imageUrl = data.listImagesUrl[0];
          }
          this.chatHeaderObj.title = data.assetTitle;
          this.chatHeaderObj.address = Helper.getAddressDetailStr(data.address, Helper.getDisplayOptionAddressId(data));
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({ isLoading: false });
        })
    } else {
      this.chatHeaderObj = null;
    }

    NotificationUtils.addOnReceivedListener(this.onNotificationReceived);
    this.reloadChatList();
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      if (this._isMounted) {
        if (Helper.isObjectNotNull(this.chatMessage.appointmentId) && !isNaN(this.lastStatusId)
          && (Helper.PEN_VAL_CONDIDATE_ID == this.lastStatusId || Helper.PRO_LEASE_ID == this.lastStatusId
            || Helper.REQ_LEASE_ID == this.lastStatusId || AssetInventoryHelper.INVENTORY_REQUEST_ID == this.lastStatusId)
          && (!Helper.isObjectNotNull(this.chatMessage.contractId) || Boolean(0 == this.chatMessage.contractId))) {
          this.setState({ isLoading: true });
          Helper.ASSET_BOOKING_RENTAL_TASK_SERVICE.getAssetBookingRentalTaskByAppointmentId(this.chatMessage.appointmentId, deviceTimeZone)
            .then(res => res.json())
            .then((data) => {
              if (Helper.isObjectHasProperty(data, "appointmentId")) {
                this.isShowFooter = false;
                this.lastStatusId = data.wkfStatus.id;
                this.inventoryId = data.inventoryId;
                this.isOwner = Boolean(this.currentChatUser._id == data.landlordSecUserId);
                this.chatMessage.contractId = data.contractId;

                if (Helper.isObjectNotNull(data.listImagesUrl) && data.listImagesUrl.length > 0) {
                  this.chatHeaderObj.imageUrl = data.listImagesUrl[0];
                }
                this.chatHeaderObj.title = data.assetTitle;
                this.chatHeaderObj.address = Helper.getAddressDetailStr(data.address, Helper.getDisplayOptionAddressId(data))

                if (Boolean(Helper.isObjectNotNull(this.chatMessage.category) &&
                  ChatStatusHelper.CATEGORY_INVENTORY_CODE == this.chatMessage.category)) {
                  var cotraStartDateStr = message('hou.ren.eventtype.lease.signed') + " - "
                    + DateTimeHelper.getDateAndMonth(moment(data.contractStartDateStr).format(Helper.FORMAT_YYYYMMDD_MINUS));
                  this.chatHeaderObj.detail = cotraStartDateStr;
                } else if (Helper.REQ_OWNER_SCHEDULER_ID != this.lastStatusId) {
                  var date = moment(moment(new Date(data.startDate)).format("YYYY-MM-DD"), "YYYY-MM-DD");
                  var visitDate = date.format("DD") + Helper.SPACE +
                    message("hou.ren.calendar.month." + date.format("MMM").toLowerCase()).toLowerCase().slice(0, 3) +
                    Helper.SPACE + date.format("YYYY")
                  this.chatHeaderObj.detail = message('hou.ren.asof') + Helper.SPACE + visitDate;
                }
              }
              this.setState({ isLoading: false });
            })
            .catch((err) => {
              console.log(err.message);
              this.setState({ isLoading: false });
            })
        }
        this.reloadChatList();
      }
    });

    setTimeout(() => {
      this._isMounted = true;
    }, Helper.TIMEOUT_1_SECOND);

  }

  reloadChatList() {
    this.setState({
      originalMessages: [],
      messages: [],
      isLoading: false
    }, () => {
      this.fetchChatList();
      this.markAllMessageByTopicAsRead(this.topicId, this.chatMessage.userId);
      NotificationUtils.offInFocusNotification();
    });
  }

  componentWillUnmount() {
    NotificationUtils.removeOnReceivedListener(this.onNotificationReceived);
    NotificationUtils.onInFocusNotification();
    DeviceEventEmitter.emit(DeviceEventEmitterNameHelper.INITONESIGNAL_EVENT_NAME, {});
    this._navListener.remove();
  }

  onNotificationReceived = (notification) => {
    // console.log('*** onNotificationReceived -> ', notification);
    try {
      this.appendMessageWithNotificationAdditionalDataProperty(notification);
      // this.appendMessageWithNotificationDataProperty(notification);
    } catch (error) {
      console.log('*** Error on onNotificationReceived -> ', error);
    }
  }

  appendMessageWithNotificationAdditionalDataProperty = (notification) => {
    try {
      if (!Helper.isObjectHasProperty(notification, "payload") || !Helper.isObjectHasProperty(notification.payload, "additionalData")) {
        return;
      }
      let newMessage = notification.payload.additionalData;
      if (newMessage && this.chatMessage.topicId == newMessage.topicId) {
        this.lastChatTypeMessageId = newMessage.lastChatTypeMessageId;
        let chatEventType = newMessage.eventType;
        if (ChatStatusHelper.getListChatEventType().includes(chatEventType)) {
          this.setState({ isLoading: true });
          if (Helper.isObjectNotNull(newMessage.appointmentId)) {
            Helper.ASSET_BOOKING_RENTAL_TASK_SERVICE.getAssetBookingRentalTaskByAppointmentId(newMessage.appointmentId, deviceTimeZone)
              .then(res => res.json())
              .then((data) => {
                if (Helper.isObjectHasProperty(data, "appointmentId")) {
                  this.lastStatusId = data.wkfStatus.id;
                  this.inventoryId = data.inventoryId;
                  this.reloadChatList();
                }
                this.setState({ isLoading: false });
              })
              .catch((err) => {
                console.log(err.message);
                this.assignNewChatFromNofitication(newMessage);
                this.setState({ isLoading: false });
              })
          } else if (Helper.isObjectNotNull(newMessage.reservationId)) {
            Helper.ASSET_BOOKING_RENTAL_TASK_SERVICE.getAssetBookingRentalTaskByReservationId(newMessage.appointmentId, deviceTimeZone)
              .then(res => res.json())
              .then((data) => {
                if (Helper.isObjectHasProperty(data, "reservationId")) {
                  this.lastStatusId = data.wkfStatus.id;
                  this.reloadChatList();
                }
                this.setState({ isLoading: false });
              })
              .catch((err) => {
                console.log(err.message);
                this.assignNewChatFromNofitication(newMessage);
                this.setState({ isLoading: false });
              })
          } else {
            this.assignNewChatFromNofitication(newMessage);
            this.setState({ isLoading: false });
          }
        } else {
          this.assignNewChatFromNofitication(newMessage);
        }
      }
    } catch (error) {
      console.log('*** Error on onNotificationReceived -> ', error);
    }
  }

  assignNewChatFromNofitication = (newMessage) => {
    let giftedChatUser = new GiftedChatUserModel(newMessage.userId, newMessage.userName, newMessage.profileImage);
    let gitedChatMessage = new GiftedChatModel(newMessage.id, newMessage.topicId, newMessage.message, newMessage.sentDate, giftedChatUser, newMessage.attachmentUrl,
      newMessage.chatType, newMessage.messageTitle, newMessage.messageSubTitle, newMessage.messageValue, newMessage.eventType,
      newMessage.eventClick, this.isOwner, newMessage.assetId, newMessage.appointmentId, this.lastStatusId, newMessage.lastChatTypeMessageId,
      newMessage.contractId, this.inventoryId, newMessage.reservationId, this.contractSubletId);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [gitedChatMessage])
    }));
    this.markMessageAsRead(newMessage.id, newMessage.fromUserId);
  }

  appendMessageWithNotificationDataProperty = (notification) => {
    try {
      if (!Helper.isObjectHasProperty(notification, "data")) {
        return;
      }
      let newMessage = ChatDetailsModel.fromJson(notification.data);
      if (newMessage && this.chatMessage.topicId == newMessage.topicId) {
        this.setState({
          originalMessages: [...this.state.originalMessages, ...[newMessage]]
        });
        let gitedChatMessage = newMessage.toGiftedChatMessageObject();
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, [gitedChatMessage]),
        }));
        // console.log('*** messages to append -> ', gitedChatMessage);
      }
    } catch (error) {
      console.log('*** Error on appendMessageWithNotificationDataProperty -> ', error);
    }
  }

  fetchChatList = () => {
    if (this.state.isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    Helper.CHAT_MESSAGE_SERVICE.listAllChatMessagesByTopicId(this.chatMessage.topicId, this.currentChatUser._id)
      .then(res => res.json())
      .then(this.assignChatListData)
      .catch(this.handleErrorRequest)
  }

  markMessageAsRead = (messageId, userId) => {
    Helper.CHAT_MESSAGE_SERVICE.markChatAsRead(messageId, userId);
  }

  markAllMessageByTopicAsRead = (topicId, userId) => {
    Helper.CHAT_MESSAGE_SERVICE.markAllAsRead(topicId, userId);
  }

  handleErrorRequest = (error) => {
    this.setState({ isLoading: false });
    Toast.show({
      text: "Network request failed.",
      type: "danger",
      position: "bottom",
      duration: 2000
    });
    console.log('*** error on fetchMessagesInbox', error);
  }

  assignChatListData = (jsonDatas) => {
    let chatMessageDetails = ChatDetailsModel.fromJsonArray(jsonDatas);
    let chatList = chatMessageDetails.map(item => item.toGiftedChatMessageObject(this.isOwner, this.chatMessage.assetId, this.chatMessage.appointmentId,
      this.lastStatusId, this.lastChatTypeMessageId, this.chatMessage.contractId, this.inventoryId, this.chatMessage.reservationId, this.contractSubletId));
    this.setState({ isLoading: false });
    this.setState({
      originalMessages: [...this.state.originalMessages, ...chatMessageDetails],
      messages: [...this.state.messages, ...chatList]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    // console.log("**** onSend state messages -> ", this.state.messages);
    this.sendMessages(messages);
  }

  sendMessages = (giftedChatMessages = []) => {
    const topicId = this.topicId;
    const recipientId = this.chatMessage.recipientId;
    giftedChatMessages.forEach(chat => {
      Helper.CHAT_MESSAGE_SERVICE.sendChatMessage(new ChatMessageModel(topicId, chat.user._id, recipientId, chat.text));
    });
  }

  sendMessagesWithAttachment(file) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("topicId", this.topicId);
    formData.append("fromUserId", this.currentChatUser._id);
    formData.append("recipientId", this.chatMessage.recipientId);
    this.setState({ loadingImage: true });
    Helper.CHAT_MESSAGE_SERVICE.sendChatMessageWithAttachment(formData).then(res => res.json()).then((data => {
      console.log("data: ", data);
      this.setState({ loadingImage: false });
      var message = new GiftedChatModel(data.id, file.name, data.sentDate, this.currentChatUser, file.uri);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
      }));
    })).catch(err => {
      this.setState({ loadingImage: false });
      console.log(err);
    });
  }

  chooseImage() {
    var options = {
      title: message('hou.ren.selectphoto'),
      // takePhotoButtonTitle: message('hou.ren.takephoto'),
      chooseFromLibraryButtonTitle: message('hou.ren.choosefromlibrary'),
      cancelButtonTitle: message('hou.ren.cancel'),
      // permissionDenied: {
      //     'title': message('hou.ren.msg.upload.permissiondeniedtitle'),
      //     'text': message('hou.ren.msg.upload.permissionDeniedtext'),
      //     'reTryTitle': message('hou.ren.msg.upload.permissiondeniedtitlereTry'),
      //     'okTitle': message('hou.ren.msg.upload.permissiondeniedtitleok')
      // },
      tintColor: theme.FONT_COLOR_TEXT_TITLE,
      noData: true,
      quality: 0.5,
      storageOptions: {
        skipBackup: true
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let file = {
          uri: response.uri,
          name: response.fileName,
          type: response.type
        }
        this.setState({ file: file });
        this.sendMessagesWithAttachment(file);
      }
    });
  }

  loadingModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.loadingImage}
        onRequestClose={() => this.setState({ loadingImage: false })}
      >
        <TouchableOpacity onPress={() => { this.setState({ loadingImage: false }) }} style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
        >
          <TouchableOpacity onPress={() => { }} style={{ width: '60%', height: 200 }}>
            <Container style={{ borderRadius: 10 }}>
              <ImageBackground source={{ uri: this.state.file.uri }} style={styles.backgroundImage}>
                <ActivityIndicator size='large'></ActivityIndicator>
              </ImageBackground>
            </Container>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }
  renderClaim() {
    return <ClaimBox claimBoxId={1} descriptionCard={false} />
  }

  renderChatFooterSpace = () => {
    return (<View style={{ paddingBottom: 20, width: '100%' }} />);
  }

  renderChatFooter = () => {
    return (
      Boolean(this.isShowFooter) ?
        <View style={{ paddingBottom: 20, width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity style={styles.suggestionBtn} onPress={() => {
              this.setState({ currentText: message("hou.ren.chat.response.thankyou") })
            }}>
              <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE, {
                color: theme.FONT_COLOR_TEXT_TITLE,
                fontFamily: theme.FONT_NAME_OVERPASS_REGULAR
              }]}>{message("hou.ren.chat.response.thankyou")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn} onPress={() => {
              this.setState({ currentText: message("hou.ren.chat.response.bye") })
            }}>
              <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE, {
                color: theme.FONT_COLOR_TEXT_TITLE,
                fontFamily: theme.FONT_NAME_OVERPASS_REGULAR
              }]}>{message("hou.ren.chat.response.bye")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn} onPress={() => {
              this.setState({ currentText: message("hou.ren.chat.response.havefun") })
            }}>
              <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE, {
                color: theme.FONT_COLOR_TEXT_TITLE,
                fontFamily: theme.FONT_NAME_OVERPASS_REGULAR
              }]}>{message("hou.ren.chat.response.havefun")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={{ paddingBottom: 20, width: '100%' }} />
    )
  }

  render() {
    if (Boolean(this.state.isLoading)) {
      return (
        <View style={customTextStyleHelper.LOADING_STYLE} >
          <ActivityIndicator animating={this.state.isLoading} color={theme.FONT_COLOR_LINK} size='small' />
        </View>
      );
    }
    return (
      <Container style={{ backgroundColor: theme.OFF_WHITE }}>
        <CustomHeaderLeftRightTextComponent
          // title={this.chatMessage.topic}
          title={this.chatMessage.recipientName}
          onBackPress={(e) => {
            this.markAllMessageByTopicAsRead(this.topicId, this.chatMessage.userId);
            this.props.navigation.goBack(null);
          }}
          rightComponent={
            <FontAwesomePro
              style={{
                fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
                paddingBottom: Helper.getVerticalScale(8),
                marginRight: Helper.getHorizontalScale(4)
              }}
              size={Helper.getFontSizeScale(20)}
              color={theme.FONT_COLOR_TEXT_TITLE}
              icon={Icons.shieldAlt}
            />
          }
        />
        <SafeAreaView style={styles.container}>
          {Boolean(Helper.isObjectNotNull(this.chatHeaderObj)) &&
            <ChatHeader chatHeaderObj={this.chatHeaderObj} />
          }
          <GiftedChat
            navigation={this.props.navigation}
            assetTitle={Helper.isObjectNotNull(this.chatHeaderObj) ? this.chatHeaderObj.title : Helper.EMPTY}
            text={this.state.currentText}
            onInputTextChanged={(text) => this.setState({ currentText: text })}
            messages={this.state.messages}
            user={this.currentChatUser}
            onSend={messages => this.onSend(messages)}
            renderBubble={renderCurrentUserBubble}
            renderSend={renderSendButton}
            renderInputToolbar={renderInputToolbar}
            renderMessageText={renderMessageText}
            renderMessage={renderMessage}
            onPressShowGreenProgramDialog={(messageId) => {
              this.greenProgramChatMessageId = messageId;
              this.setState({ isShowGreenProgramDialog: true });
            }}
            onPressConfirmInventoryCancel={() => {
              this.setState({ isShowConfirmInventoryCancelDialog: true });
            }}
            onPressTenantAccetpedLeaseDialog={(appointmentId, eventType) => {
              NotificationUtils.onInFocusNotification();
              this.setState({ isLoading: true }, () => {
                Helper.ASSET_APPOINTMENT_SERVICE.proposeLeaseService(appointmentId)
                  .then(res => res.json())
                  .then((data) => {
                    this.setState({ isLoading: false }, () => {
                      if (Helper.ERROR_TECHNICAL_STATUS == data.status) {
                        Toast.show({
                          text: data.desc,
                          type: "danger",
                          position: "bottom",
                          duration: Helper.TIMEOUT_3_SECOND
                        });
                      } else {
                        const eventType = data.messageEventType;
                        if (Helper.isObjectNotNull(eventType)) {
                          if (ChatStatusHelper.EVENT_VALIDATE_CONDIDATE_CODE == eventType) {
                            this.props.navigation.navigate("ProfileDocument", {
                              appointmentId: appointmentId
                            });
                          } else {
                            this.props.navigation.goBack(null);  
                          }
                        } else {
                          this.props.navigation.goBack(null);
                        }
                      }
                    });
                  }).catch(err => {
                    Toast.show({
                      text: err.message,
                      type: "danger",
                      position: "bottom",
                      duration: Helper.TIMEOUT_3_SECOND
                    });
                    this.setState({ isLoading: false });
                  });
              });
            }}
            renderActions={(props) => {
              var actionProps = {};
              actionProps = { ...props, onChoosePhoto: () => { this.chooseImage() } }
              return renderActions(actionProps)
            }}
            scrollToBottomComponent={renderScrollToBottomComponent}
            renderComposer={renderComposer}
            // renderChatFooter={this.renderChatFooter} // hide suggessions footer
            renderChatFooter={this.renderChatFooterSpace}
            placeholder={message('hou.ren.chat.writeyourmessage')}
            alwaysShowSend
            scrollToBottom
          />
          {
            this.loadingModal()
          }
          {Boolean(this.state.isShowGreenProgramDialog) && <MoienGreenProgramModal
            visible={this.state.isShowGreenProgramDialog}
            onSelect={() => {
              this.setState({ isShowGreenProgramDialog: false }, () => {
                if (Helper.PRO_LEASE_ID == this.lastStatusId) {
                  if (this.greenProgramChatMessageId != Helper.EMPTY) {
                    NotificationUtils.onInFocusNotification();
                    Helper.CHAT_MESSAGE_SERVICE.validateCondidate(this.greenProgramChatMessageId)
                      .then(res => res.json())
                      .then((data) => {
                        this.props.navigation.goBack(null);
                      }).catch(console.log)
                  }
                }
              });
            }}
            onPressClose={(e) => this.setState({ isShowGreenProgramDialog: false })}
          />
          }
          {Boolean(this.state.isShowConfirmInventoryCancelDialog) &&
            CustomDialogComponent.showConfirmDialogOkCancel(
              Helper.EMPTY,
              message('hou.ren.inventory.tenant.cancel') + " ?",
              this.state.isShowConfirmInventoryCancelDialog,
              onOk = (e) => {
                this.setState({ isShowConfirmInventoryCancelDialog: false }, () => {
                  if (Helper.isObjectNotNull(this.inventoryId) && !isNaN(this.inventoryId)) {
                    this.setState({ isLoading: true });
                    Helper.INVENTORY_SERVICE.cancelInventory(this.inventoryId)
                      .then(response => {
                        if (Helper.SUCCESS_STATUS === response.status) {
                          return response.json()
                        } else if (Helper.ERROR_TECHNICAL_STATUS === response.status) {
                          throw response.json().desc;
                        } else {
                          throw response.json().message;
                        }
                      })
                      .then((data) => {
                        this.setState({ isLoading: false }, () => {
                          this.props.navigation.goBack(null);
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        this.setState({ isLoading: false });
                      });
                  }
                });
              },
              onCancel = (e) => {
                this.setState({ isShowConfirmInventoryCancelDialog: false });
              }
            )
          }
        </SafeAreaView>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: Platform.OS == 'ios' ? 10 : 5,
    marginRight: Platform.OS == 'ios' ? 10 : 5,
    padding: Platform.OS == 'ios' ? 30 : 14,
    padding: Platform.OS == 'ios' ? 30 : 14,

    backgroundColor: theme.OFF_WHITE
  },
  suggestionBtn: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: theme.FONT_COLOR_TEXT_TITLE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 5,
    backgroundColor: theme.WHITE
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 10,
    opacity: 0.5,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});
export default withNavigation(ChatScreen);