import React from "react";
import theme from "../theme/theme";
import { View, StyleSheet, Linking, Text, TouchableOpacity } from "react-native";
import { IconButton, ThemeProvider } from "react-native-paper";
import { Badge, Thumbnail, Toast } from "native-base";
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
  Bubble,
  MessageText,
} from "react-native-gifted-chat";
import HTML from "react-native-render-html";
import FontAwesomePro, { Icons } from "react-native-fonts-awesomepro";
import Helper from "../../helper/helper";
import customTextStyleHelper from "../../helper/custom-text-style.helper";
import ChatStatusHelper from "../../helper/chat-status.helper";
import { message } from '../../I18n/i18n';
import moment from "moment";
import ChatModel from "../../api/model/chat/chat.model";
import DateTimeHelper from "../../helper/date-time.helper";
import AssetInventoryHelper from "../../helper/inventory/asset-inventory.helper";
import AssetAppointmentHelper from "../../helper/asset-appointment.helper";
import AssetReservationHelper from "../../helper/asset-reservation.helper";
import ContractHelper from "../../helper/contract.helper";
import navigationHelper, { dispatchSearchAction } from "../../helper/navigation.helper";
import AuthorizationSublettingRequestModel from "../../api/model/asset/authorization-subletting-request.model";
import ContractSublettingHelper from "../../helper/contract-subletting.helper";
import NotificationUtils from "../../helper/notification-utils";

const styles = StyleSheet.create({
  sendButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: Helper.getHorizontalScale(15),
  },
  scrollBottomComponentContainer: {
    justifyContent: "center",
  },
  chatText: {
    textAlign: "left",
    color: theme.WHITE,
    lineHeight: Helper.isAndroidPlatform() ? 18 : 0,
    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
  },
  containerStyle: {
    width: Helper.getHorizontalScale(45),
    height: Helper.getVerticalScale(45),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    marginRight: Helper.getHorizontalScale(-8),
    paddingRight: "6%",
    marginBottom: 0,
  },
  composer: {
    flexDirection: "row",
    borderColor: "rgba(202,202,216,0.5)",
    borderWidth: 1.5,
    borderRadius: 6,
    flex: 1,
  },
  textInputStyle: {
    backgroundColor: theme.WHITE,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: theme.WHITE,
    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
    paddingTop: 8.5,
    paddingLeft: 12,
    marginLeft: 0,
    marginRight: 0,
  },
  viewButtonActionLayoutStyle: {
    marginTop: Helper.getVerticalScale(5),
    paddingTop: Helper.getVerticalScale(12),
    paddingBottom: Helper.getVerticalScale(8),
    backgroundColor: theme.WHITE,
    // paddingLeft: Helper.getHorizontalScale(6),
    // paddingRight: Helper.getHorizontalScale(2.5),
    paddingLeft: Helper.getHorizontalScale(Helper.isIOSPlatform() ? 12 : 6),
    paddingRight: Helper.getHorizontalScale(Helper.isIOSPlatform() ? 5 : 2.5),
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 0.5,
    // borderColor: theme.SECONDARY_BG_COLOR,
    borderColor: "rgba(202,202,216,0.5)",
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.23,
    elevation: 2,
    marginBottom: Helper.getVerticalScale(10)
  },
  viewButtonActionStyle: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(Helper.isIOSPlatform() ? 15 : 17.5),
    paddingVertical: Helper.getVerticalScale(10),
  }
});

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      paddingBottom: Helper.getVerticalScale(4),
      backgroundColor: theme.WHITE,
      borderTopWidth: 0,
    }}
    primaryStyle={{
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.WHITE,
      borderRadius: 6,
    }}
  />
);

export function renderActions(props) {
  return (
    <Actions
      {...props}
      containerStyle={styles.containerStyle}
      icon={() => (
        <FontAwesomePro
          style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
          size={Helper.getVerticalScale(24)}
          color={theme.BORDER_COLOR}
          icon={Icons.image}
        />
      )}
      options={{
        "Attach Photo": props.onChoosePhoto,
        Cancel: () => {
          console.log("Cancel");
        },
      }}
      optionTintColor="#222B45"
    />
  );
}

export function renderMessage(props) {
  const { navigation, assetTitle, onPressTenantAccetpedLeaseDialog, onPressShowGreenProgramDialog, onPressConfirmInventoryCancel } = props;
  var messageObj = props.currentMessage;
  var prevMessage = props.previousMessage;

  const currentUserId = props.user._id;

  const chatType = messageObj.chatType;
  const messageTitle = messageObj.messageTitle;
  const messageSubTitle = messageObj.messageSubTitle;
  const messageValue = messageObj.messageValue;
  const eventType = messageObj.eventType;
  const eventClick = Boolean(messageObj.eventClick);
  const isOwner = Boolean(messageObj.isOwner);
  const lastChatTypeMessageId = messageObj.lastChatTypeMessageId;
  const appointmentId = messageObj.appointmentId;
  const inventoryId = messageObj.inventoryId;
  const reservationId = messageObj.reservationId;

  const isAppointment = Boolean(Helper.isObjectNotNull(appointmentId) && !isNaN(appointmentId));
  const isReservation = Boolean(Helper.isObjectNotNull(reservationId) && !isNaN(reservationId));

  let icon = Icons.exclamationCircle;
  // let title = message('hou.ren.chat.status.pending');
  let title = Helper.EMPTY;
  if (ChatStatusHelper.TYPE_VALIDATION_CODE == chatType) {
    icon = Icons.checkCircle;
    // title = message('hou.ren.chat.status.accepted');
  } else if (ChatStatusHelper.TYPE_QUESTION_CODE == chatType) {
    icon = Icons.questionCircle;
    // title = "Gestion de bail";
  } else if (ChatStatusHelper.TYPE_REFUSED_CODE == chatType) {
    icon = Icons.timesCircle;
    // title = message('hou.ren.chat.status.archived');
  }

  if (Helper.isObjectNotNull(messageTitle) && messageTitle != Helper.EMPTY) {
    title = messageTitle.trim();
  }

  // It use for click cencel from create contract process
  var chatMessage = new ChatModel();
  chatMessage.topicId = messageObj.topicId;
  chatMessage.userId = messageObj.user._id;
  chatMessage.userName = messageObj.user.name;
  chatMessage.appointmentId = messageObj.appointmentId;
  chatMessage.lastChatTypeMessageId = messageObj.lastChatTypeMessageId;
  chatMessage.lastStatusId = messageObj.lastStatusId;
  chatMessage.contractId = messageObj.contractId;
  chatMessage.assetId = messageObj.assetId;
  // -----------------------------

  const isFromMoienUser = Boolean(Helper.MOIEN_USER_ID === chatMessage.userId);
  const isSendBySystem = Boolean(isFromMoienUser || isAppointment || isReservation);

  var messageText = Helper.EMPTY;
  if (Helper.isObjectNotNull(messageObj)
    && Helper.isObjectNotNull(messageObj.text)) {
    messageText = messageObj.text.trim();
  }

  var showDate = true;
  var currentMessageDate = moment(messageObj.createdAt).format(Helper.FORMAT_DDMMYYYY_SLASH);
  var currentMessageDateTime = moment(messageObj.createdAt).format(Helper.FORMAT_DDMMYYYY_HHMM_SLASH);
  var prevMessageDate = Helper.isObjectNotNull(prevMessage.createdAt) ? moment(prevMessage.createdAt).format(Helper.FORMAT_DDMMYYYY_SLASH) : null;
  var prevMessageDateTime = Helper.isObjectNotNull(prevMessage.createdAt) ? moment(prevMessage.createdAt).format(Helper.FORMAT_DDMMYYYY_HHMM_SLASH) : null;
  var today = moment().format(Helper.FORMAT_DDMMYYYY_SLASH);

  if (currentMessageDate == today) {
    if (Helper.isObjectNotNull(prevMessageDateTime) && currentMessageDateTime == prevMessageDateTime) {
      showDate = false;
    }
  } else if (Helper.isObjectNotNull(prevMessageDate) && currentMessageDate == prevMessageDate) {
    showDate = false;
  }

  var dateTimeText = Helper.EMPTY;
  var createdDate = moment(messageObj.createdAt).format(Helper.FORMAT_YYYYMMDD_MINUS);
  var firstDayOfCurrentYear = moment().startOf('year').format(Helper.FORMAT_YYYYMMDD_MINUS)
  var yesterday = moment(new Date()).add(-1, 'days').format(Helper.FORMAT_YYYYMMDD_MINUS);
  var today = moment(new Date()).format(Helper.FORMAT_YYYYMMDD_MINUS);
  if (createdDate < firstDayOfCurrentYear) {
    dateTimeText = DateTimeHelper.getShortDateMonthYear(createdDate);
  } else if (createdDate < yesterday) {
    dateTimeText = DateTimeHelper.getDateAndMonth(createdDate);
  } else if (createdDate < today) {
    dateTimeText = message('hou.ren.yesterday').toLowerCase();
  } else if (createdDate == today) {
    dateTimeText = moment(messageObj.createdAt).format("HH:mm");
  }
  if (
    /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
      messageText
    )
  ) {
    return (
      <View style={{
        marginLeft: Helper.getHorizontalScale(4),
        marginRight: Helper.getHorizontalScale(8)
      }}>
        {
          showDate &&
          <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE,
          {
            alignSelf: 'center'
          }]}>
            {dateTimeText}
          </Text>
        }
        <View style={{
          paddingHorizontal: 8, paddingVertical: 8,
          borderRadius: 6, maxWidth: Helper.getHorizontalScale(215),
          alignSelf: Boolean("right" == props.position) ? 'flex-end' : 'flex-start',
          backgroundColor: Boolean("right" == props.position) ? theme.FONT_COLOR_TEXT_TITLE :
            theme.SECONDARY_BG_COLOR, marginBottom: Helper.getVerticalScale(10)
        }}>
          <HTML
            html={messageText}
            onLinkPress={(event, href, attr) => {
              Linking.canOpenURL(href).then((supported) => {
                if (!supported) {
                  console.log("No handler for URL:", href);
                } else {
                  Linking.openURL(href);
                }
              });
            }}
            tagsStyles={{
              p: {
                textAlign: "left",
                color: Boolean("right" == props.position)
                  ? theme.WHITE
                  : theme.FONT_COLOR_TEXT_BODY,
                fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                fontSize: Helper.getFontSizeScale(theme.FONT_SIZE_CAPTION),
                textTransform: 'none',
                lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(22),
              },
            }}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ marginHorizontal: Helper.getHorizontalScale(4) }}>
        {
          showDate &&
          <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE,
          {
            alignSelf: 'center'
          }]}>
            {dateTimeText}
          </Text>
        }
        {Boolean(chatType) ?
          <View style={styles.viewButtonActionLayoutStyle}>
            <View style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              marginBottom: Helper.getVerticalScale(4)
            }}>
              <FontAwesomePro
                style={{
                  fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
                  marginRight: Helper.getHorizontalScale(2.5)
                }}
                size={Helper.getVerticalScale(20)}
                color={theme.FONT_COLOR_TEXT_TITLE}
                icon={icon}
              />
              <Badge style={{
                backgroundColor: theme.FONT_COLOR_LINK,
                height: Helper.getVerticalScale(20),
              }}>
                <Text style={{
                  color: theme.WHITE,
                  fontFamily: theme.FONT_NAME_OVERPASS_SEMIBOLD,
                  textAlign: "center", justifyContent: 'space-around',
                  alignItems: 'center',
                  fontSize: Helper.getFontSizeScale(12)
                }}>
                  {title}
                </Text>
              </Badge>
            </View>
            {Boolean(Helper.isObjectNotNull(messageSubTitle) && messageSubTitle != Helper.EMPTY)
              &&
              <View>
                <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE,
                {
                  color: theme.FONT_COLOR_TEXT_TITLE,
                  paddingVertical: 8,
                  paddingLeft: 0, paddingRight: 8
                }]}>
                  {messageSubTitle}
                </Text>
              </View>
            }
            <View style={{
              width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(Helper.isIOSPlatform() ? 5 : 17.5),
              borderRadius: 6,
              alignSelf: Boolean("right" == props.position) ? 'flex-start' : 'flex-start',
              backgroundColor: Boolean(isSendBySystem) ? theme.WHITE :
                Boolean("right" == props.position) ? theme.FONT_COLOR_TEXT_TITLE : theme.SECONDARY_BG_COLOR,
              marginBottom: Helper.getVerticalScale(5)
            }}>
              <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE,
              {
                color: Boolean(isSendBySystem) ? theme.FONT_COLOR_TEXT_TITLE :
                  Boolean("right" == props.position) ? theme.WHITE : theme.FONT_COLOR_TEXT_BODY,
                paddingVertical: 8, minHeight: Helper.getVerticalScale(35), paddingRight: 8,
                // paddingLeft: 8, paddingRight: 16,
              }]}>
                {messageText}
              </Text>
              {Boolean(Helper.isObjectNotNull(messageValue) && messageValue != Helper.EMPTY)
                &&
                <Text style={[customTextStyleHelper.TITLE_TEXT_H3_STYLE,
                {
                  color: theme.FONT_COLOR_TEXT_TITLE, paddingRight: 8,
                  // paddingLeft: 8, paddingRight: 16,
                }]}>
                  {messageValue}
                </Text>
              }
            </View>
            {Boolean(isReservation && ChatStatusHelper.EVENT_RESERVATION_CONFIRMED_CODE == eventType
              && !eventClick && (AssetReservationHelper.RESERVATION_PENDING_ID == chatMessage.lastStatusId
                || AssetReservationHelper.RESERVATION_ACCEPTED_ID == chatMessage.lastStatusId)) &&
              <View style={styles.viewButtonActionStyle}>
                {Boolean(!isOwner) ?
                  renderReservationActionButton(navigation, message('hou.ren.reservation.bookingdetail.event'), reservationId)
                  :
                  Boolean(AssetReservationHelper.RESERVATION_ACCEPTED_ID == chatMessage.lastStatusId) ?
                    renderReservationActionButton(navigation, message('hou.ren.reservation.bookingdetail.event'), reservationId)
                    :
                    renderReservationConfirmPendingActionButton(navigation, reservationId)
                }
              </View>
            }
            {Boolean(isReservation && ChatStatusHelper.EVENT_RESERVATION_RATING_CODE == eventType
              && !eventClick && AssetReservationHelper.RESERVATION_END_ID == chatMessage.lastStatusId) &&
              <View style={styles.viewButtonActionStyle}>
                {renderReservationRatingActionButton(navigation, chatMessage, reservationId, isOwner)}
              </View>
            }
            {Boolean((ChatStatusHelper.EVENT_REQUEST_VISIT_CODE == eventType
              || ChatStatusHelper.EVENT_VALIDATE_VISIT_CODE == eventType)
              && ChatStatusHelper.EVENT_UPDATE_VISIT_ACCEPTED_CODE != eventType
              && !eventClick && !isReservation) &&
              Boolean(messageObj._id == lastChatTypeMessageId) ?
              Boolean(AssetAppointmentHelper.isVisitorReqPending(messageObj.lastStatusId)) ?
                <View style={styles.viewButtonActionStyle}>
                  {isOwner &&
                    renderVisitActionButton(navigation, message('hou.ren.visit.accept'), appointmentId)
                  }
                  {isOwner &&
                    renderVisitActionButton(navigation, message('hou.ren.refuse'), appointmentId)
                  }
                  {isOwner &&
                    renderVisitActionLinkButton(navigation, message('hou.ren.view-detail.visit'), appointmentId)
                  }
                  {!isOwner &&
                    renderVisitActionButton(navigation, message('hou.ren.cancel'), appointmentId)
                  }
                  {!isOwner &&
                    renderVisitActionButton(navigation, message('hou.ren.modify'), appointmentId)
                  }
                </View> :
                Boolean(Helper.REQ_ACCEPTED_ID == messageObj.lastStatusId
                  || Helper.REQ_INV_ACCEPTED_ID == messageObj.lastStatusId) ?
                  <View style={styles.viewButtonActionStyle}>
                    {renderVisitActionLinkButton(navigation, message('hou.ren.eventtype.view-detail'), appointmentId, false)}
                  </View> :
                  Boolean((Helper.REQ_UPDATED_ID == messageObj.lastStatusId
                    || Helper.REQ_INV_UPDATED_ID == messageObj.lastStatusId) && !isOwner) ?
                    <View style={styles.viewButtonActionStyle}>
                      {renderVisitActionButton(navigation, message('hou.ren.visit.accept'), appointmentId)}
                      {renderVisitActionButton(navigation, message('hou.ren.modify'), appointmentId)}
                      {renderVisitActionLinkButton(navigation, message('hou.ren.cancel'), appointmentId)}
                    </View> : null
              : null
            }

            {Boolean(ChatStatusHelper.EVENT_REFUSED_VISIT_CODE == eventType) &&
              Boolean((Helper.REQ_REFUSED_ID == messageObj.lastStatusId
                || Helper.REQ_CANCELLED_ID == messageObj.lastStatusId
                || Helper.REQ_VISITOR_CANCEL_ID == messageObj.lastStatusId
                || Helper.REQ_INV_REFUSED_ID == messageObj.lastStatusId
                || Helper.REQ_INV_CANCELLED_ID == messageObj.lastStatusId
                || Helper.REQ_INV_VISITOR_CANCEL_ID == messageObj.lastStatusId
              ) && !isOwner) ?
              <View style={styles.viewButtonActionStyle}>
                {renderSearchAssetActionButton(message('hou.ren.visit.perform-new-search'))}
              </View>
              : null
            }

            {Boolean(isOwner && ChatStatusHelper.EVENT_TERMINATED_LEASE_MGT_PROCESS_CODE == eventType &&
              Boolean(ContractHelper.CONTRACT_TERMINATED_ID == messageObj.lastStatusId ||
                AssetInventoryHelper.INVENTORY_CANCELLED_ID == messageObj.lastStatusId)) ?
              <View style={styles.viewButtonActionStyle}>
                {renderGoToAdParameterActionButton(currentUserId, message('hou.ren.visit.republish-your-ad'), chatMessage, assetTitle)}
              </View>
              :
              null
            }

            {Boolean(Helper.PRO_LEASE_ID == messageObj.lastStatusId && isOwner
              && ChatStatusHelper.EVENT_VALIDATE_CONDIDATE_CODE == eventType && !eventClick && !isReservation) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderValidateCandidateActionButton(navigation, true, message('hou.ren.msg.answer.yes'), chatMessage, assetTitle, messageObj._id)
                }
                {
                  renderValidateCandidateActionButton(navigation, false, message('hou.ren.msg.answer.no'), chatMessage, assetTitle, messageObj._id)
                }
              </View>
              :
              null
            }
            {Boolean(Helper.DRA_LEASE_ID == messageObj.lastStatusId && isOwner
              && ChatStatusHelper.EVENT_ACCEPTED_BY_CANDIDATE_CODE == eventType && !eventClick && !isReservation) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderCandidateAcceptedProposeLeaseActionButton(navigation, message('hou.ren.chat.btn.letgo'), messageObj._id)
                }
              </View>
              :
              null
            }
            {Boolean(Helper.DRA_LEASE_ID == messageObj.lastStatusId && isOwner && !eventClick && !isReservation
              && ChatStatusHelper.EVENT_SUBSCRIBE_MOIEN_LEASE_SERVICE_CODE == eventType) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderSubscribeMoienServiceActionButton(navigation, true, message('hou.ren.visit.subscribe-service'), messageObj._id)
                }
                {/* {
                  renderSubscribeMoienServiceActionButton(navigation, false, message('hou.ren.msg.answer.no'), messageObj._id)
                } */}
              </View>
              :
              null
            }
            {Boolean(Helper.PEN_VAL_CONDIDATE_ID == messageObj.lastStatusId && !isOwner
              && !eventClick && !isReservation && (ChatStatusHelper.EVENT_VALIDATE_CONDIDATE_CODE == eventType
                || ChatStatusHelper.EVENT_VALIDATE_CONDIDATE_EMPTY_DOC_REQUIRED_CODE == eventType
                || ChatStatusHelper.EVENT_VALIDATE_CONDIDATE_PREVIOUSLY_UPLOADED_CODE == eventType)) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderCandidateConfirmProposeLeaseActionButton(navigation, true, message('hou.ren.visit.accept'), appointmentId, messageObj._id, onPressTenantAccetpedLeaseDialog, eventType)
                }
                {
                  renderCandidateConfirmProposeLeaseActionButton(navigation, false, message('hou.ren.refuse'), appointmentId, messageObj._id)
                }
              </View>
              :
              null
            }
            {Boolean((Helper.PEN_VAL_CONDIDATE_ID == messageObj.lastStatusId
              || Helper.REQ_LEASE_PENDING_ID == messageObj.lastStatusId) && !eventClick && !isReservation
              && ChatStatusHelper.EVENT_MOIEN_VALIDATED_TENANT_DOCUMENT_CODE == eventType && isOwner) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderMoienValidatedTenantDocumentAction(navigation, chatMessage)
                }
              </View>
              :
              null
            }
            {Boolean(Helper.REQ_LEASE_ID == messageObj.lastStatusId && isOwner && !eventClick && !isReservation
              && Boolean(ChatStatusHelper.EVENT_START_LEASE_MGT_PROCESS_CODE == eventType || eventType == Helper.EMPTY)) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderContractActionButton(navigation, message('hou.ren.chat.btn.letgo'), chatMessage)
                }
              </View>
              :
              null
            }
            {Boolean(Helper.REQ_LEASE_PENDING_ID == messageObj.lastStatusId && !eventClick && !isReservation
              && (ChatStatusHelper.EVENT_ELECTRONIC_SIGNATURE_PROCESS_CODE == eventType ||
                ChatStatusHelper.EVENT_ACCEPTED_LEASE_MGT_PROCESS_CODE == eventType) && !isOwner) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderElectronicSignatureActionButton(navigation, message('hou.ren.visit.viewlease'), chatMessage, currentUserId, isOwner)
                }
              </View>
              :
              null
            }
            {Boolean(ContractHelper.CONTRACT_UPDATED_ID == messageObj.lastStatusId && !eventClick && !isReservation
              && ChatStatusHelper.EVENT_UPDATE_LEASE_MGT_PROCESS_CODE == eventType && isOwner) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderContractChangeActionButton(navigation, message('hou.ren.visit.viewlease'), chatMessage, currentUserId, isOwner)
                }
              </View>
              :
              null
            }
            {Boolean(Boolean(ContractHelper.CONTRACT_UPDATED_ID == messageObj.lastStatusId
              || Helper.REQ_LEASE_PENDING_ID == messageObj.lastStatusId)
              && !eventClick && !isReservation
              && (eventType == Helper.EMPTY || ChatStatusHelper.EVENT_UPDATE_LEASE_MGT_PROCESS_CODE == eventType) && !isOwner) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderElectronicSignatureActionButton(navigation, message('hou.ren.visit.viewlease'), chatMessage, currentUserId, isOwner)
                }
              </View>
              :
              null
            }
            {Boolean(!eventClick && !isReservation && !isOwner
              && (ContractHelper.CONTRACT_CANCELLED_ID != messageObj.lastStatusId)
              && (ChatStatusHelper.EVENT_UPDATED_DOCUMENT_CODE == eventType
                || ChatStatusHelper.EVENT_REJECTED_DOCUMENT_CODE == eventType)) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderProfileDocumentActionButton(navigation, appointmentId, messageObj.contractId)
                }
              </View>
              :
              null
            }
            {Boolean(Helper.REQ_LEASE_BEING_SIGNED_ID == messageObj.lastStatusId && !eventClick && !isReservation
              && (eventType == Helper.EMPTY || ChatStatusHelper.EVENT_ELECTRONIC_SIGNATURE_PROCESS_CODE == eventType) && isOwner) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderElectronicSignatureActionButton(navigation, message('hou.ren.visit.signlease'), chatMessage, currentUserId, isOwner)
                }
              </View>
              :
              null
            }
            {Boolean(!eventClick && ChatStatusHelper.EVENT_ACTIVATED_LEASE_MGT_PROCESS_CODE == eventType
              && Boolean(ContractHelper.CONTRACT_ACTIVATED_ID == messageObj.lastStatusId ||
                AssetInventoryHelper.INVENTORY_REQUEST_ID == messageObj.lastStatusId)) ?
              Boolean(isOwner) ? renderLandlordInventoryActionButton(navigation, currentUserId, chatMessage.assetId, inventoryId, onPressConfirmInventoryCancel)
                : renderTenantPropertyDetailActionButton(navigation, message('hou.ren.visit.viewlease'), currentUserId)
              : null
            }
            {Boolean(AssetInventoryHelper.PROPOSE_INVENTORY_SERVICE_ID == messageObj.lastStatusId && isOwner && !eventClick && !isReservation
              && ChatStatusHelper.EVENT_SUBSCRIBE_MOIEN_INVENTORY_SERVICE_CODE == eventType) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderSubscribeMoienInventoryServiceActionButton(navigation, true, message('hou.ren.msg.answer.yes'), messageObj._id)
                }
                {
                  renderSubscribeMoienInventoryServiceActionButton(navigation, false, message('hou.ren.msg.answer.no'), messageObj._id)
                }
              </View>
              :
              null
            }
            {Boolean(AssetInventoryHelper.INVENTORY_REQUEST_ID == messageObj.lastStatusId && !eventClick && !isReservation
              && Boolean(eventType == Helper.EMPTY || ChatStatusHelper.EVENT_START_INVENTORY_PROCESS_CODE == eventType)) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderInventoryActionButton(navigation, currentUserId, !isOwner, chatMessage.assetId, inventoryId)
                }
              </View>
              :
              null
            }
            {Boolean((AssetInventoryHelper.INVENTORY_TENANT_UPDATE_ID == messageObj.lastStatusId
              || AssetInventoryHelper.INVENTORY_PENDING_ID == messageObj.lastStatusId) && isOwner && !eventClick && !isReservation
              && ChatStatusHelper.EVENT_TENANT_UPDATE_INVENTORY_CODE == eventType) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderInventoryScreenActionButton(navigation, message('hou.ren.consult'), chatMessage, isOwner)
                }
              </View>
              :
              null
            }
            {Boolean(AssetInventoryHelper.INVENTORY_PENDING_ID == messageObj.lastStatusId && !eventClick && !isReservation
              && Boolean(eventType == Helper.EMPTY || ChatStatusHelper.EVENT_ACCEPTED_UPDATE_INVENTORY_CODE == eventType)) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderInventoryScreenActionButton(navigation, message('hou.ren.consult'), chatMessage, isOwner)
                }
              </View>
              :
              null
            }
            {Boolean(AssetInventoryHelper.INVENTORY_VALIDATE_ID == messageObj.lastStatusId && !eventClick && !isReservation
              && Boolean(eventType == Helper.EMPTY || ChatStatusHelper.EVENT_ELECTRONIC_SIGNATURE_INVENTORY_CODE == eventType)) ?
              <View style={styles.viewButtonActionStyle}>
                {
                  renderInventoryPdfScreenActionButton(navigation, message('hou.ren.consult'), chatMessage, isOwner, currentUserId, inventoryId)
                }
              </View>
              :
              null
            }
            {Boolean(!eventClick && !isReservation && ChatStatusHelper.EVENT_REQUEST_SUBLETTING_CODE == eventType) ?
              <View>
                {Boolean(Helper.isObjectNotNull(messageObj.contractSubletId) && !isNaN(messageObj.contractSubletId) && messageObj.contractSubletId > 0) ?
                  <View style={styles.viewButtonActionStyle}>
                    {
                      renderTenantSublettingSignActionButton(navigation, message("hou.ren.ads.sublet.contract.sign"), messageObj.contractSubletId)
                    }
                  </View>
                  :
                  <View style={styles.viewButtonActionStyle}>
                    {renderLandlordResponseSubletRequestFromTenantActionButton(navigation, true, message('hou.ren.msg.answer.yes'), currentUserId, chatMessage.assetId, assetTitle, messageObj._id)}
                    {renderLandlordResponseSubletRequestFromTenantActionButton(navigation, false, message('hou.ren.msg.answer.no'), currentUserId, chatMessage.assetId, assetTitle, messageObj._id)}
                  </View>
                }
              </View>
              :
              null
            }
            {
              Boolean(isOwner && !isReservation && ((!eventClick && ChatStatusHelper.EVENT_TENANT_SIGN_SUBLETTING_CODE == eventType)
                || (ChatStatusHelper.EVENT_TERMINATED_SUBLETTING_CODE == eventType || ChatStatusHelper.EVENT_END_SUBLETTING_CODE == eventType))) ?
                <View style={styles.viewButtonActionStyle}>
                  {
                    renderContractSublettingViewActionButton(navigation, Boolean(ContractSublettingHelper.CON_SUB_ACTIVATED_ID == chatMessage.lastStatusId
                      || ContractSublettingHelper.CON_SUB_TERMINATED_ID == chatMessage.lastStatusId
                      || ContractSublettingHelper.CON_SUB_END_ID == chatMessage.lastStatusId) ?
                      message("hou.ren.ads.sublet.contract.view") : message("hou.ren.ads.sublet.contract.sign"), messageObj.contractSubletId)
                  }
                </View>
                :
                null
            }
            {
              Boolean(!isOwner && !eventClick && !isReservation && (ChatStatusHelper.EVENT_LANDLORD_SIGN_SUBLETTING_CODE == eventType
                || ChatStatusHelper.EVENT_TERMINATED_SUBLETTING_CODE == eventType
                || ChatStatusHelper.EVENT_END_SUBLETTING_CODE == eventType)) ?
                <View style={styles.viewButtonActionStyle}>
                  {
                    renderContractSublettingViewActionButton(navigation, message("hou.ren.ads.sublet.contract.view"), messageObj.contractSubletId)
                  }
                </View>
                :
                null
            }
          </View>
          :
          <View style={{
            borderRadius: 6, maxWidth: Helper.getHorizontalScale(215),
            alignSelf: Boolean("right" == props.position) ? 'flex-end' : 'flex-start',
            backgroundColor: Boolean("right" == props.position) ? theme.FONT_COLOR_TEXT_TITLE :
              theme.SECONDARY_BG_COLOR, marginBottom: Helper.getVerticalScale(10),
            marginRight: Helper.getHorizontalScale(4)
          }}>
            {Boolean(Helper.isValidUrl(messageObj.image)) &&
              <Thumbnail
                source={{ uri: messageObj.image }}
                square={true}
                large={true}
              />
            }
            <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE,
            {
              color: Boolean("right" == props.position) ? theme.WHITE :
                theme.FONT_COLOR_TEXT_BODY, padding: 8, minHeight: Helper.getVerticalScale(35)
            }]}>
              {messageText}
            </Text>
          </View>
        }
      </View>
    );
  }
};

function renderVisitActionLinkButton(navigation, title, appointmentId, hasMarginTop = true) {
  return <TouchableOpacity
    style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: Helper.getVerticalScale(Boolean(hasMarginTop) ? 15 : 0) }}
    onPress={(e) => {
      navigation.navigate('VisitScreen',
        { appointmentId: appointmentId })
    }}
  >
    <FontAwesomePro
      style={{
        fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
        paddingVertical: Helper.getVerticalScale(3)
      }}
      size={customTextStyleHelper.TEXT_FONT_SIZE_H5}
      color={theme.FONT_COLOR_LINK}
      icon={Icons.arrowRight}
    />
    <Text style={[customTextStyleHelper.TEXT_LINK, {
      fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
      marginLeft: Helper.getHorizontalScale(5),
    }]}>
      {title}
    </Text>
  </TouchableOpacity>
}

function renderVisitActionButton(navigation, title, appointmentId) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
    }]}
    onPress={(e) => {
      navigation.navigate('VisitScreen',
        { appointmentId: appointmentId })
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderValidateCandidateActionButton(navigation, isValidated, title, chatMessage, assetTitle, messageId, onPressShowGreenProgramDialog) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
    }]}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      if (Boolean(isValidated)) {
        navigation.navigate("LeaseDocumentRequireScreen", {
          assetId: chatMessage.assetId,
          assetTitle: assetTitle,
          appointmentId: chatMessage.appointmentId,
          chatMessage: chatMessage
        });
        // onPressShowGreenProgramDialog && onPressShowGreenProgramDialog(messageId);
        // Helper.CHAT_MESSAGE_SERVICE.validateCondidate(messageId)
        //   .then(res => res.json())
        //   .then((data) => {
        //     navigation.goBack(null);
        //   })
        //   .catch(console.log)
      } else {
        Helper.CHAT_MESSAGE_SERVICE.moveToArchived(messageId)
          .then(res => res.json())
          .then(() => {
            navigation.goBack(null);
          })
          .catch(console.log)
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderProfileDocumentActionButton(navigation, appointmentId, contractId) {
  return <TouchableOpacity
    style={{ justifyContent: "flex-start", flexDirection: "row" }}
    disabled={!Helper.isObjectNotNull(contractId) && !Helper.isObjectNotNull(appointmentId)}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      if (Helper.isObjectNotNull(contractId) && !isNaN(contractId) && contractId > 0) {
        navigation.navigate("ProfileDocument", {
          contractId: contractId,
        })
      } else {
        navigation.navigate("ProfileDocument", {
          appointmentId: appointmentId,
        })
      }
    }}
  >
    <FontAwesomePro
      style={{
        fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
        paddingVertical: Helper.getVerticalScale(3)
      }}
      size={customTextStyleHelper.TEXT_FONT_SIZE_H5}
      color={theme.FONT_COLOR_LINK}
      icon={Icons.arrowToBottom}
    />
    <Text style={[customTextStyleHelper.TEXT_LINK, {
      fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
      marginLeft: Helper.getHorizontalScale(5),
      textTransform: 'lowercase'
    }]}>
      {message('hou.ren.contracts.uploadthedocument')}
    </Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} isValidated 
 * @param {*} title 
 * @param {*} appointmentId 
 * @param {*} messageId 
 * @param {*} onPressTenantAccetpedLeaseDialog 
 * @param {*} eventType 
 * @returns 
 */
function renderCandidateConfirmProposeLeaseActionButton(navigation, isValidated, title, appointmentId, messageId, onPressTenantAccetpedLeaseDialog, eventType) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
    }]}
    onPress={(e) => {
      if (Boolean(isValidated)) {
        onPressTenantAccetpedLeaseDialog && onPressTenantAccetpedLeaseDialog(appointmentId, eventType);
      } else {
        Helper.CHAT_MESSAGE_SERVICE.moveToArchived(messageId)
          .then(res => res.json())
          .then(() => {
            navigation.goBack(null);
          })
          .catch(console.log)
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderCandidateAcceptedProposeLeaseActionButton(navigation, title, messageId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH
    }]}
    onPress={(e) => {
      Helper.CHAT_MESSAGE_SERVICE.landlordValidateProposeLease(messageId)
        .then(res => res.json())
        .then((data) => {
          navigation.goBack(null);
        })
        .catch(console.log)
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} messageObj 
 * @param {*} currentUserId 
 * @returns 
 */
function renderMoienValidatedTenantDocumentAction(navigation, messageObj) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(messageObj.appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(50)
    }]}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      const contractId = messageObj.contractId;
      const appointmentId = messageObj.appointmentId;
      if (Boolean(Helper.isObjectNotNull(contractId) && !isNaN(contractId) && contractId > 0)) {
        navigation.navigate("LeaseSupportDocumentScreen", {
            contractId: contractId,
            readOnly: true
        });
      } else {
        navigation.navigate("LeaseSupportDocumentScreen", {
          appointmentId: appointmentId,
          readOnly: true
      });
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{message('hou.ren.view-detail.document')}</Text>
  </TouchableOpacity>
}

function renderSubscribeMoienServiceActionButton(navigation, isSubscribed, title, messageId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(Helper.isIOSPlatform() ? 12 : 18)
    }]}
    onPress={(e) => {
      if (Boolean(isSubscribed)) {
        Helper.CHAT_MESSAGE_SERVICE.subscribeContractMgtService(messageId)
          .then(res => res.json())
          .then(() => {
            navigation.goBack(null);
          })
          .catch(console.log)
      } else {
        Helper.CHAT_MESSAGE_SERVICE.moveToArchived(messageId)
          .then(res => res.json())
          .then(() => {
            navigation.goBack(null);
          })
          .catch(console.log)
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderContractActionButton(navigation, title, messageObj) {
  const appointmentId = messageObj.appointmentId;
  const contractId = messageObj.contractId;
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH
    }]}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      if (Boolean(Helper.isObjectNotNull(contractId) && !isNaN(contractId) && contractId > 0)) {
        Helper.CONTRACT_SERVICE.getContract(contractId)
          .then(res => res.json())
          .then((data) => {
            if (Helper.isObjectHasProperty(data, "appointmentId")) {
              let contractDTO = data;
              switch (contractDTO.currentStep) {
                case ContractHelper.LEASE_STEP_2:
                  navigation.navigate("LeaseMgtStep2Screen", {
                    contractDTO: contractDTO,
                    chatMessage: messageObj
                  });
                  break;
                case ContractHelper.LEASE_STEP_3:
                  navigation.navigate("LeaseMgtStep3Screen", {
                    contractDTO: contractDTO,
                    chatMessage: messageObj
                  });
                  break;
                case ContractHelper.LEASE_STEP_4:
                  navigation.navigate("LeaseMgtStep4Screen", {
                    contractDTO: contractDTO,
                    chatMessage: messageObj
                  });
                  break;
                case ContractHelper.LEASE_STEP_5:
                  navigation.navigate("LeaseMgtStep5Screen", {
                    contractDTO: contractDTO,
                    chatMessage: messageObj
                  });
                  break;
                default:
                  navigation.navigate("LeaseMgtStep1Screen", {
                    contractDTO: contractDTO,
                    appointmentId: contractDTO.appointmentId,
                    chatMessage: messageObj
                  })
                  break;
              }
            }
          })
          .catch(err => {
            console.log("err: ", err)
          })
      } else if (Helper.isObjectNotNull(appointmentId) && !isNaN(appointmentId) && appointmentId > 0) {
        navigation.navigate('LeaseMgtStep1Screen', {
          chatMessage: messageObj
        })
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderContractChangeActionButton(navigation, title, messageObj, currentUserId, isLandlord) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(messageObj.appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      alignSelf: 'center',
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH + Helper.getHorizontalScale(50)
    }]}
    onPress={(e) => {
      if (Boolean(!isNaN(messageObj.contractId)) && !isNaN(currentUserId)) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("LeasePdfViewerScreen", {
          contractId: messageObj.contractId,
          userId: currentUserId,
          isLandlordView: isLandlord
        });
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderLandlordInventoryActionButton(navigation, currentUserId, assetId, inventoryId, onPressConfirmInventoryCancel) {
  return <View>
    <TouchableOpacity
      disabled={!Helper.isObjectNotNull(currentUserId)}
      style={[customTextStyleHelper.BUTTON_STYLE, {
        backgroundColor: theme.WHITE, width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(Helper.isIOSPlatform() ? 12 : 18)
      }]}
      onPress={(e) => {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("PropertyCalendarInventory", {
          secUserId: currentUserId,
          assetId: assetId,
          inventoryId: inventoryId
        });
      }}
    >
      <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
        color: theme.FONT_COLOR_TEXT_TITLE
      }]}>{message('hou.ren.account.manageads.myavailabilities')}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      disabled={!Helper.isObjectNotNull(currentUserId)}
      style={{
        justifyContent: "center", flexDirection: 'row', marginTop: Helper.getVerticalScale(10),
        width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(Helper.isIOSPlatform() ? 12 : 18)
      }}
      onPress={(e) => {
        onPressConfirmInventoryCancel && onPressConfirmInventoryCancel();
      }}
    >
      <Text numberOfLines={1} style={[customTextStyleHelper.TEXT_LINK, {
        fontFamily: theme.FONT_NAME_OVERPASS_BOLD
      }]}>
        {message('hou.ren.inventory.planning.refuse')}
      </Text>
    </TouchableOpacity>
  </View>
}

function renderTenantPropertyDetailActionButton(navigation, title, currentUserId) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(currentUserId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      alignSelf: 'center',
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH + Helper.getHorizontalScale(50)
    }]}
    onPress={(e) => {
      if (Boolean(!isNaN(currentUserId))) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("UserListCurrentContractScreen", {
          secUserId: currentUserId,
          isViewForLandlord: false
        });
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderElectronicSignatureActionButton(navigation, title, messageObj, currentUserId, isLandlord) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(messageObj.appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH + Helper.getHorizontalScale(50)
    }]}
    onPress={(e) => {
      if (Boolean(!isNaN(messageObj.contractId)) && !isNaN(currentUserId)) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("LeasePdfViewerScreen", {
          contractId: messageObj.contractId,
          userId: currentUserId,
          isLandlordView: isLandlord
        });
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderSubscribeMoienInventoryServiceActionButton(navigation, isSubscribed, title, messageId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
    }]}
    onPress={(e) => {
      if (Boolean(isSubscribed)) {
        Helper.CHAT_MESSAGE_SERVICE.subscribeInventoryService(messageId)
          .then(res => res.json())
          .then(() => {
            navigation.goBack(null);
          })
          .catch(console.log)
      } else {
        Helper.CHAT_MESSAGE_SERVICE.unsubscribeInventoryService(messageId)
          .then(res => res.json())
          .then(() => {
            navigation.goBack(null);
          })
          .catch(console.log)
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderTenantSublettingSignActionButton(navigation, title, contractSubletId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH + Helper.getHorizontalScale(70)
    }]}
    onPress={(e) => {
      if (Boolean(Helper.isObjectNotNull(contractSubletId) && !isNaN(contractSubletId) && contractSubletId > 0)) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("ContractSublettingFileViewerScreen", {
          contractSubletId: contractSubletId
        })
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderAuthorizationSublettingConfirmationActionButton(navigation, isOwner, isAccepted, title, contractSubletId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
    }]}
    onPress={(e) => {
      if (Boolean(Helper.isObjectNotNull(contractSubletId) && !isNaN(contractSubletId) && contractSubletId > 0)) {
        const requestModel = new AuthorizationSublettingRequestModel();
        requestModel.contractSubletId = contractSubletId;
        requestModel.landlordProcessed = isOwner;
        NotificationUtils.onInFocusNotification();
        if (Boolean(isAccepted)) {
          navigation.navigate("ContractSublettingFileViewerScreen", {
            contractSubletId: contractSubletId
          })
        } else {
          Helper.ASSET_SUBLETTING_SERVICE.rejectedSublettingProcess(requestModel)
            .then(res => res.json())
            .then(() => {
              navigation.goBack(null);
            })
            .catch(console.log)
        }
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

function renderContractSublettingViewActionButton(navigation, title, contractSubletId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH + Helper.getHorizontalScale(70)
    }]}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      navigation.navigate("ContractSublettingFileViewerScreen", {
        contractSubletId: contractSubletId
      });
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} isAccepted 
 * @param {*} title 
 * @param {*} secUserId 
 * @param {*} assetId 
 * @param {*} assetTitle 
 * @param {*} messageId 
 * @returns 
 */
function renderLandlordResponseSubletRequestFromTenantActionButton(navigation, isAccepted, title, secUserId, assetId, assetTitle, messageId) {
  return <TouchableOpacity
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
    }]}
    onPress={(e) => {
      if (Boolean(isAccepted)) {
        navigationHelper.navigateToUserManageAdsParameter(secUserId, assetId, assetTitle);
      } else {
        if (Helper.isObjectNotNull(messageId)) {
          Helper.CHAT_MESSAGE_SERVICE.landlordRejectSubletTenantRequest(messageId)
            .then(res => res.json())
            .then(() => {
              navigation.goBack(null);
            })
            .catch(console.log)
        }
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{title}</Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} currentUserId 
 * @param {*} isTenantView 
 * @param {*} assetId 
 * @param {*} inventoryId 
 * @returns 
 */
function renderInventoryActionButton(navigation, currentUserId, isTenantView, assetId, inventoryId) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(currentUserId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_100_PER_WIDTH - Helper.getHorizontalScale(Helper.isIOSPlatform() ? 12 : 18)
    }]}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      Boolean(isTenantView) ?
        Helper.REA_ASSET_SERVICE.getReaAssetById(assetId)
          .then(res => res.json())
          .then((assetModel) => {
            if (Helper.isObjectHasProperty(assetModel, "id")) {
              let assetVisitRequestVO = AssetAppointmentHelper.getAssetVisitRequestVO(assetModel);
              navigation.navigate("VisitBookingSlot", {
                secUserId: currentUserId,
                assetVisitRequestVO: assetVisitRequestVO,
                inventoryId: inventoryId
              })
            }
          })
          .catch(err => {
            console.log("err: ", err)
          })
        :
        navigation.navigate("PropertyCalendarInventory", {
          secUserId: currentUserId,
          assetId: assetId,
          inventoryId: inventoryId
        });
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>{Boolean(isTenantView) ? message('hou.ren.eventtype.inventory.planning') : message('hou.ren.account.manageads.myavailabilities')}</Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} title 
 * @param {*} messageObj 
 * @param {*} isOwnerView 
 * @returns 
 */
function renderInventoryScreenActionButton(navigation, title, messageObj, isOwnerView) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(messageObj.appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH
    }]}
    onPress={(e) => {
      if (Boolean(!isNaN(messageObj.contractId))) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("AssetInventoryScreen", {
          contractId: messageObj.contractId,
          isTenantView: Boolean(!isOwnerView)
        });
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, { color: theme.FONT_COLOR_TEXT_TITLE }]}>
      {title}
    </Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} title 
 * @param {*} messageObj 
 * @param {*} isOwnerView 
 * @param {*} currentUserId 
 */
function renderInventoryPdfScreenActionButton(navigation, title, messageObj, isOwnerView, currentUserId, inventoryId) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(messageObj.appointmentId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH
    }]}
    onPress={(e) => {
      if (Boolean(!isNaN(inventoryId))) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate("InventoryPdfViewerScreen", {
          inventoryId: inventoryId,
          userId: currentUserId,
          isLandlordView: isOwnerView
        });
      }
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, { color: theme.FONT_COLOR_TEXT_TITLE }]}>
      {title}
    </Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} chatMessage 
 * @param {*} reservationId 
 * @param {*} isOwner 
 * @returns 
 */
function renderReservationRatingActionButton(navigation, chatMessage, reservationId, isOwner) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(reservationId)}
    style={[customTextStyleHelper.BUTTON_STYLE, {
      backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH + Helper.getHorizontalScale(50)
    }]}
    onPress={(e) => {
      NotificationUtils.onInFocusNotification();
      navigation.navigate('GeneralExperienceRateScreen', {
        chatMessage: chatMessage,
        reservationId: reservationId,
        peoAssetTypeId: Boolean(isOwner) ? Helper.PEO_ASSET_TYPE_OWNER_ID : Helper.PEO_ASSET_TYPE_TENANT_ID
      })
    }}
  >
    <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
      color: theme.FONT_COLOR_TEXT_TITLE
    }]}>
      {message('hou.ren.reservation.evaluatethestay')}
    </Text>
  </TouchableOpacity>
}

/**
 * 
 * @param {*} navigation
 * @param {*} reservationId 
 * @returns 
 */
function renderReservationConfirmPendingActionButton(navigation, reservationId) {
  return <View style={{ flexDirection: 'row', display: 'flex', flexWrap: 'wrap' }}>
    <TouchableOpacity
      disabled={!Helper.isObjectNotNull(reservationId)}
      style={[customTextStyleHelper.BUTTON_STYLE, {
        backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12),
        marginRight: Helper.getVerticalScale(2.5)
      }]}
      onPress={(e) => {
        NotificationUtils.onInFocusNotification();
        navigation.navigate('VisitScreen', { reservationId: reservationId })
      }}
    >
      <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
        color: theme.FONT_COLOR_TEXT_TITLE
      }]}>{message('hou.ren.visit.accept')}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      disabled={!Helper.isObjectNotNull(reservationId)}
      style={[customTextStyleHelper.BUTTON_STYLE, {
        backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12),
        marginLeft: Helper.getVerticalScale(2.5)
      }]}
      onPress={(e) => {
        NotificationUtils.onInFocusNotification();
        navigation.navigate('VisitScreen', { reservationId: reservationId })
      }}
    >
      <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
        color: theme.FONT_COLOR_TEXT_TITLE
      }]}>{message('hou.ren.refuse')}
      </Text>
    </TouchableOpacity>
  </View>
}

/**
 * 
 * @param {*} navigation 
 * @param {*} title 
 * @param {*} reservationId 
 * @param {*} currentUserId 
 * @returns 
 */
function renderReservationActionButton(navigation, title, reservationId) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(reservationId)}
    style={{ justifyContent: "flex-start", flexDirection: "row" }}
    onPress={(e) => {
      if (Boolean(!isNaN(reservationId))) {
        NotificationUtils.onInFocusNotification();
        navigation.navigate('VisitScreen', { reservationId: reservationId });
      }
    }}
  >
    <FontAwesomePro
      style={{
        fontFamily: theme.FONT_NAME_AWESOME5PRO_LIGHT,
        paddingVertical: Helper.getVerticalScale(3)
      }}
      size={Helper.getFontSizeScale(16)}
      color={theme.FONT_COLOR_LINK}
      icon={Icons.eye}
    />
    <Text style={[customTextStyleHelper.TEXT_LINK, {
      fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
      marginLeft: Helper.getHorizontalScale(5), textTransform: "lowercase"
    }]}>
      {title}
    </Text>
  </TouchableOpacity>
}

function renderSearchAssetActionButton(title) {
  return <TouchableOpacity
    style={{ justifyContent: "flex-start", flexDirection: "row" }}
    onPress={(e) => { dispatchSearchAction() }}
  >
    <FontAwesomePro
      style={{
        fontFamily: theme.FONT_NAME_AWESOME5PRO_LIGHT,
        paddingVertical: Helper.getVerticalScale(3)
      }}
      size={Helper.getFontSizeScale(16)}
      color={theme.FONT_COLOR_LINK}
      icon={Icons.eye}
    />
    <Text style={[customTextStyleHelper.TEXT_LINK, {
      fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
      marginLeft: Helper.getHorizontalScale(5), textTransform: "lowercase"
    }]}>
      {title}
    </Text>
  </TouchableOpacity>
}

function renderGoToAdParameterActionButton(currentUserId, title, messageObj, assetTitle) {
  return <TouchableOpacity
    disabled={!Helper.isObjectNotNull(messageObj.appointmentId)}
    style={{ justifyContent: "flex-start", flexDirection: "row" }}
    onPress={(e) => {
      navigationHelper.navigateToUserManageAdsParameter(currentUserId, messageObj.assetId, assetTitle);
    }}
  >
    <FontAwesomePro
      style={{
        fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
        paddingVertical: Helper.getVerticalScale(3)
      }}
      size={customTextStyleHelper.TEXT_FONT_SIZE_H5}
      color={theme.FONT_COLOR_LINK}
      icon={Icons.arrowRight}
    />
    <Text style={[customTextStyleHelper.TEXT_LINK, {
      fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
      marginLeft: Helper.getHorizontalScale(5),
    }]}>
      {title}
    </Text>
  </TouchableOpacity>
}

export function renderMessageText(props) {
  var messageObj = props.currentMessage;
  let icon = Icons.exclamationCircle;
  let title = "sinistre";
  if (ChatStatusHelper.TYPE_VALIDATION_CODE == messageObj.chatType) {
    icon = Icons.checkCircle;
    title = "Locataire validé";
  } else if (ChatStatusHelper.TYPE_QUESTION_CODE == messageObj.chatType) {
    icon = Icons.questionCircle;
    title = "Gestion de bail";
  } else if (ChatStatusHelper.TYPE_REFUSED_CODE == messageObj.chatType) {
    icon = Icons.timesCircle;
    title = "Locataire refusé";
  }

  var messageText = Helper.EMPTY;
  if (Helper.isObjectNotNull(messageObj)
    && Helper.isObjectNotNull(messageObj.text)) {
    messageText = messageObj.text.trim();
  }

  if (
    /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
      messageText
    )
  ) {
    return (
      <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
        <HTML
          html={messageText}
          onLinkPress={(event, href, attr) => {
            Linking.canOpenURL(href).then((supported) => {
              if (!supported) {
                console.log("No handler for URL:", href);
              } else {
                Linking.openURL(href);
              }
            });
          }}
          tagsStyles={{
            p: {
              textAlign: "left",
              color: Boolean("right" == props.position)
                ? theme.WHITE
                : theme.BLACK,
            },
          }}
        />
      </View>
    );
  } else {
    return Boolean(messageObj.chatType) ?
      <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesomePro
            style={{
              fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
              marginRight: Helper.getHorizontalScale(2.5)
            }}
            size={Helper.getVerticalScale(18)}
            color={Boolean("right" == props.position) ?
              theme.WHITE : theme.FONT_COLOR_TEXT_TITLE}
            icon={icon}
          />
          <Badge style={{
            backgroundColor: Boolean("right" == props.position) ?
              theme.WHITE : theme.FONT_COLOR_LINK, height: Helper.getVerticalScale(18)
          }}>
            <Text style={{
              color: Boolean("right" == props.position) ?
                theme.FONT_COLOR_TEXT_TITLE : theme.WHITE,
              fontFamily: theme.FONT_NAME_OVERPASS_SEMIBOLD,
              textAlign: "center", justifyContent: 'center',
              fontSize: Helper.getFontSizeScale(12)
            }}>
              {title}
            </Text>
          </Badge>
        </View>
        <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE,
        {
          color: Boolean("right" == props.position) ? theme.WHITE :
            theme.FONT_COLOR_TEXT_BODY, padding: 8
        }]}>
          {messageText}
        </Text>
        {/* <MessageText {...props} /> */}
      </View>
      :
      <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE,
      {
        color: Boolean("right" == props.position) ? theme.WHITE :
          theme.FONT_COLOR_TEXT_BODY, padding: 8
      }]}>
        {messageText}
      </Text>
  }
}
export const renderComposer = (props) => {
  return (
    <View style={styles.composer}>
      <Composer {...props} textInputStyle={styles.textInputStyle} />
    </View>
  );
};

export const renderCurrentUserBubble = (props) => (
  <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor: theme.FONT_COLOR_TEXT_TITLE,
      },
    }}
    textStyle={{
      right: {
        color: theme.WHITE,
      },
    }}
  />
);

export const renderScrollToBottomComponent = () => (
  <View style={styles.scrollBottomComponentContainer}>
    <IconButton
      icon="chevron-double-down"
      size={Helper.getVerticalScale(30)}
      color={theme.FONT_COLOR_LINK}
    />
  </View>
);

export const renderSendButton = (props) => (
  <Send {...props}>
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: Helper.getVerticalScale(8)
      }}
    >
      <IconButton
        icon="send-circle"
        size={Helper.getVerticalScale(26)}
        color={theme.FONT_COLOR_LINK}
        style={{ width: "100%" }}
      />
    </View>
  </Send>
);
