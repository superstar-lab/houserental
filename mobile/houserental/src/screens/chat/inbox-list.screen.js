import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import InboxListScreen from "./messages-list.screen";

class InboxWithOutFilter extends Component {
  render() {
    return <InboxListScreen withFilter={false} />;
  }
}

export default withNavigation(InboxWithOutFilter);
