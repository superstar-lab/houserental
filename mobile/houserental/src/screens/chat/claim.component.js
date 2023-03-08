import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Badge } from "native-base";
import theme from "../theme/theme";
import Helper from "../../helper/helper";
import customTextStyleHelper from "../../helper/custom-text-style.helper";
import { message } from "../../I18n/i18n";
import FontAwesomePro, { Icons } from "react-native-fonts-awesomepro";
import { convertNumber } from "../finances/utilities/convertNumber";
import { currency } from "../finances/utilities/currency";
// sinistre type=1
// locataire validé: type=2
// gestion de bail: type=3
const claims = [
    {
        claimBoxId:2,
        title: "sinistre",
        Desc: "Moïen vous propose l’usage d’un bail standard reçu par les juristes. Il est intégralement électronique, de son remplissage jusqu’à la signature par vous et vos locataires.",
        
    }
]
const ConfirmationBox = () => (
  <View
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      height: Helper.getVerticalScale(50),
      marginTop: Helper.getVerticalScale(17),
      paddingHorizontal: Helper.getHorizontalScale(8),
    }}
  >
    <TouchableOpacity
      style={[customTextStyleHelper.BUTTON_STYLE, {
        backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
      }]}
    >
      <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
        color: theme.FONT_COLOR_TEXT_TITLE
      }]}>{message('hou.ren.msg.answer.yes')}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[customTextStyleHelper.BUTTON_STYLE, {
        backgroundColor: theme.WHITE, width: theme.BUTTON_50_PER_WIDTH - Helper.getHorizontalScale(12)
      }]}
    >
      <Text style={[customTextStyleHelper.BUTTON_TITLE_TEXT_STYLE, {
        color: theme.FONT_COLOR_TEXT_TITLE
      }]}>{message('hou.ren.msg.answer.no')}</Text>
    </TouchableOpacity>
  </View>
);

const ClaimBox = (props) => {
  const { claimBoxId, title, desc, descriptionCard } = props;
  const currencySymbole = currency("EUR");
  const renderBadge = () => {
    let icon = null;
    let text = null;
    switch (claimBoxId) {
      case 1:
        icon = Icons["exclamationCircle"];
        text = "sinistre";
        break;
      case 2:
        icon = Icons["checkCircle"];
        text = "Locataire validé";
        break;
      default:
        icon = Icons["questionCircle"];
        text = "Gestion de bail";
        break;
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesomePro style={styles.exclamation} icon={icon} />
        <View style={styles.badgeContainer}>
          <Badge style={styles.badge}>
            <Text style={styles.claimButton}>{text}</Text>
          </Badge>
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={[styles.boxShadowTop, styles.claimBox]}>
        {renderBadge()}
        <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE, styles.title]}>
          Votre locataire vous informe d’un sinistre.
        </Text>
        <Text
          style={[
            styles.description,
            false ? styles.descriptionCard : null,
          ]}
        >
          Moïen vous propose l’usage d’un bail standard reçu par les juristes.
          Il est intégralement électronique, de son remplissage jusqu’à la
          signature par vous et vos locataires.
        </Text>
       {true &&  <Text // changes with the type of the notification
          style={[
            customTextStyleHelper.TITLE_TEXT_H4_STYLE,
            { color: "#010D3C", marginTop:8 },
          ]}
        >
          {convertNumber(3.9)}
          {currencySymbole}{"/par bail"}
        </Text>}
      </View>
      <ConfirmationBox />
    </>
  );
};
const styles = StyleSheet.create({
  claimBox: {
    backgroundColor: "white",
    flexDirection: "column",
    borderWidth: 0,
    borderRadius: 8,
    borderColor: theme.WHITE,
    // marginBottom: Helper.getVerticalScale(0),
    paddingHorizontal: Helper.getHorizontalScale(12),
    paddingVertical: Helper.getVerticalScale(12),
  },
  claimButton: {
    color: "white",
    marginLeft: Helper.getHorizontalScale(2),
    marginRight: Helper.getHorizontalScale(2),
    textAlign: "center",
  },
  exclamation: {
    fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
    paddingRight: Helper.getHorizontalScale(5),
    paddingVertical: Helper.getHorizontalScale(1),
    fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H2,
    color: theme.FONT_COLOR_TEXT_TITLE,
  },
  description: {
    // padding: Helper.getHorizontalScale(10),
    fontSize: 12,
    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
    lineHeight: 18,
    color: theme.FONT_COLOR_TEXT_BODY,
  },
  descriptionCard: {
    backgroundColor: theme.SECONDARY_BG_COLOR,
    borderRadius: 6,
  },
  boxShadowTop: {
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.23,
    elevation: 10,
  },
  title: {
    color: theme.FONT_COLOR_TEXT_TITLE,
    paddingVertical: Helper.getVerticalScale(12),
  },
  badgeContainer: {
    paddingRight: Helper.getHorizontalScale(8),
    justifyContent: "center",
  },
  badge: {
    backgroundColor: theme.FONT_COLOR_LINK,
    height: Helper.getVerticalScale(20),
  },
});
ClaimBox.propTypes = {
  type: PropTypes.number.isRequired,
};
export default ClaimBox;
