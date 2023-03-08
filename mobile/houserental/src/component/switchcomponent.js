import React, {} from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { Text, Label } from "native-base";
import Helper from "../helper/helper";
import theme from "../screens/theme/theme";
import ToggleSwitch from "toggle-switch-react-native";
import FontAwesomePro, { Icons } from "react-native-fonts-awesomepro";
import customTextStyleHelper from "../helper/custom-text-style.helper";

export default function SwitchComponent(props) {
  const {
    label,
    value,
    disabled,
    onValueChange,
    iconSize,
    marginFromTop,
    marginFromBottom,
    isHideBottomLine,
    isLabelColorBlue,
  } = props;

  return (
    <React.Fragment>
      <View style={[styles.mainBox, {
        marginTop: Helper.getVerticalScale(isNaN(parseInt(marginFromTop)) ? 20 : marginFromTop),
        marginBottom: Helper.getVerticalScale(isNaN(parseInt(marginFromBottom)) ? 20 : marginFromBottom)
      }]}>
        <View style={styles.labelContainer}>
          <Label>
            <Text
              style={[
                Boolean(isLabelColorBlue) ? customTextStyleHelper.TITLE_TEXT_H3_STYLE :
                  customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                {
                  color: Boolean(isLabelColorBlue) ? theme.FONT_COLOR_TEXT_TITLE : theme.FONT_COLOR_TEXT_BODY,
                  fontFamily: Boolean(isLabelColorBlue) ?
                    theme.FONT_NAME_OVERPASS_BOLD
                    :
                    Boolean(value)
                      ? theme.FONT_NAME_OVERPASS_BOLD
                      : theme.FONT_NAME_OVERPASS_REGULAR,
                },
              ]}
            >
              {label}
            </Text>
          </Label>
        </View>
        <View style={[{ paddingRight: Boolean(value) ? 7 : 0 }]}>
          <ToggleSwitch
            icon={
              <FontAwesomePro
                style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID }}
                color={theme.WHITE}
                size={Helper.getFontSizeScale(iconSize)}
                icon={Boolean(value) ? Icons.check : Icons.times}
              />
            }
            disabled={Boolean(disabled)}
            isOn={Boolean(value)}
            thumbOnStyle={styles.thumbOnStyle}
            thumbOffStyle={Boolean(disabled) ? styles.thumbDisabledStyle : styles.thumbOffStyle}
            trackOffStyle={{ height: 30 }}
            trackOnStyle={{ height: 30 }}
            onColor={"rgba(202,202,216,0.3)"}
            offColor={"rgba(202,202,216,0.3)"}
            size="large"
            onToggle={(isOn) => onValueChange && onValueChange(isOn)}
          />
        </View>
      </View>
      {Boolean(!isHideBottomLine) && (
        <View style={customTextStyleHelper.LINE_SEPARATOR_STYLE} />
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  labelContainer: {
    flex: 4.4,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thumbOnStyle: {
    backgroundColor: theme.FONT_COLOR_LINK,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  thumbOffStyle: {
    backgroundColor: theme.FONT_COLOR_TEXT_TITLE_2,
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 0,
  },
  thumbDisabledStyle: {
    backgroundColor: "rgba(202,202,216,0.3)",
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 0,
    opacity: 0.3,
  },
});
SwitchComponent.propType = {
  marginFromTop: PropTypes.number,
  marginFromBottom: PropTypes.number,
  label: PropTypes.string,
  onValueChange: PropTypes.func,
  iconSize: PropTypes.number,
  isHideBottomLine: PropTypes.bool
};
SwitchComponent.defaultProps = {
  marginFromTop: null,
  marginFromBottom: null,
  iconSize: 14,
  isHideBottomLine: true
};
