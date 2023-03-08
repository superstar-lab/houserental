import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import InboxListScreen from "./messages-list.screen";

class InboxWithFilter extends Component {
  render() {
    return <InboxListScreen withFilter={true} />;
  }
}

export default withNavigation(InboxWithFilter);
