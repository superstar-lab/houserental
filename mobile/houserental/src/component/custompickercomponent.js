import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import theme from '../screens/theme/theme';
import { message } from '../I18n/i18n';
import {
    Header,
    Left,
    Body,
    Right,
    Title,
    Icon,
    Button,
    Picker,
    Text
} from 'native-base';
const { width } = Dimensions.get("window");
const pickerItemFullWidth = width - 20;

/** */
class CustomPickerComponent extends Component {

    render() {
        const { items, selectedValue, onValueChange, isFullWidth, enabled, placeholder } = this.props;
        return (
            <Picker
                renderHeader={backAction =>
                    <Header style={{ backgroundColor: theme.OFF_WHITE }}>
                        <Left>
                            <Button transparent onPress={backAction}>
                                <Icon style={{ color: theme.CELADON_BLUE }} name="ios-arrow-back" />
                                {/* <Text style={{ fontFamily: theme.FONT_NAME, color: theme.CELADON_BLUE }}>{message('hou.ren.back')}</Text> */}
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            <Title style={{ color: theme.BLACK, fontFamily: theme.FONT_NAME_OVERPASS_REGULAR }}>{message('hou.ren.pleaseselect')}</Title>
                        </Body>
                        <Right />
                    </Header>}
                mode="dropdown"
                enabled={enabled}
                placeholder={placeholder != '' && placeholder != null ? placeholder : message('hou.ren.select')}
                placeHolderTextStyle={{ flex: 1, fontFamily: theme.FONT_NAME_OVERPASS_REGULAR }}
                headerBackButtonTextStyle={{ fontFamily: theme.FONT_NAME_OVERPASS_REGULAR }}
                headerTitleStyle={{ fontFamily: theme.FONT_NAME_OVERPASS_REGULAR }}
                iosHeader={message('hou.ren.pleaseselect')}
                headerBackButtonText={message('hou.ren.back')}
                iosIcon={<Icon name="ios-arrow-down" />}
                style={{ width: isFullWidth ? pickerItemFullWidth : pickerItemFullWidth / 2 }}
                placeholderStyle={{ color: theme.FOGGY, fontFamily: theme.FONT_NAME_OVERPASS_REGULAR }}
                placeholderIconColor="#007aff"
                itemTextStyle={{ fontFamily: theme.FONT_NAME_OVERPASS_REGULAR }}
                textStyle={{ fontFamily: theme.FONT_NAME_OVERPASS_REGULAR, flex: 1, width: isFullWidth ? 300 : 150, marginLeft: -10 }}
                selectedValue={selectedValue}
                onValueChange={(e) => onValueChange && onValueChange(e)}>
                {items}
            </Picker>
        );
    }
}

const styles = StyleSheet.create({
});

export default withNavigation(CustomPickerComponent);

