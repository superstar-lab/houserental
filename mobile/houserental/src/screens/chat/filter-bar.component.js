import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { withNavigation } from "react-navigation";
import theme from "../theme/theme";
import Helper from "../../helper/helper";
import customTextStyleHelper from "../../helper/custom-text-style.helper";
import { message } from "../../I18n/i18n";

class FilterBar extends Component {
  constructor() {
    super();
    this.state = {
      filtersList: [
        { id: 1, value: message("hou.ren.all"), enabled: true },
        {
          id: 2,
          value: message("hou.ren.visit.pendingrequest"),
          enabled: false,
        },
        {
          id: 3,
          value: message("hou.ren.bookingsetting.reservation"),
          enabled: false,
        },
        { id: 4, value: message("hou.ren.unread"), enabled: false },
      ],
    };
  }
  updateFilter = (id) => {
    // Update the state of selected filter
    let updatedList = this.state.filtersList.map((item) => {
      if (item.id === id) {
        item.enabled = true;
        this.props.renderFilteredList(item.id);
      } else item.enabled = false;
      return item;
    });

    this.setState({
      filtersList: updatedList,
    });
  };

  renderFilter = (item, key) => {
    return (
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          this.updateFilter(item.id);
        }}
        key={key}
      >
        <View
          style={[
            item.enabled ? styles.enabled : styles.disabled,
            styles.boxItem,
          ]}
        >
          <Text
            style={{
              fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H5,
              alignSelf: "center",
              color: item.enabled
                ? theme.FONT_COLOR_TEXT_BODY
                : theme.BORDER_COLOR,
              fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
            }}
          >
            {item.value}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView style={{ height: Helper.getVerticalScale(50) }}>
        <ScrollView showsHorizontalScrollIndicator={false} style={{flexGrow:1}}>
          <View
            style={styles.Container}
          >
          {this.state.filtersList.map((index, key) => {
            return this.renderFilter(index, key);
          })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  filterButton: {
    textTransform: "capitalize",
    alignItems: "center",
    justifyContent: "center",
    borderLeftColor: "transparent",
    height: Helper.getVerticalScale(40),
  },

  enabled: {
    borderColor: theme.FONT_COLOR_LINK,
    borderBottomWidth: 4,
  },
  disabled: {
    borderColor: "transparent",
    borderBottomWidth: 1,
  },
  boxItem: {
    paddingBottom: Helper.getVerticalScale(5),
    paddingLeft: Helper.getHorizontalScale(8),
    paddingRight: Helper.getHorizontalScale(8),
    height: Helper.getVerticalScale(40),
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  Container:{
    borderColor: theme.SECONDARY_BG_COLOR,
    height: Helper.getVerticalScale(40),
    borderBottomWidth: 1,
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "row",
  }
});

export default withNavigation(FilterBar);
