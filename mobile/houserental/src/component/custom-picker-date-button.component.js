import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import FontAwesomePro, { Icons } from 'react-native-fonts-awesomepro';
import theme from '../screens/theme/theme';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import {
    Title,
    Text,
    ListItem,
    View
} from 'native-base';
import ModalPickerComponent from '../component/custom-picker.modal';
import { message } from '../I18n/i18n';
import Helper from '../helper/helper';

/** */
class CustomPickerDateButtonComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemSelectedId: null,
            isModalVisible: false,
        }
    }

    componentDidMount() {
        const idSelected = this.props.itemSelectedId;
        this.setState({
            itemSelectedId: idSelected
        })
    }

    /**
     * 
     */
    renderModal = (title, listItem, onValueChange) => {
        return (
            <ModalPickerComponent
                title={title}
                listOption={listItem}
                itemSelectedId={this.state.itemSelectedId}
                isModalVisible={this.state.isModalVisible}
                isRequired={this.props.isRequired}
                onClose={(e) => {
                    this.setState({ itemSelectedId: e, isModalVisible: false });
                    onValueChange && onValueChange(e);
                }}
                onSave={(e) => {
                    setTimeout(() => {
                        this.setState({ itemSelectedId: e, isModalVisible: false });
                        onValueChange && onValueChange(e);
                    }, 500);
                }} />
        );
    }

    /**
     * 
     * @param {*} captionValue 
     * @param {*} listItem 
     * @param {*} itemSelectedId 
     */
    getTextCaption(captionValue, isShowCaptionValue, listItem) {
        let caption = captionValue;
        const idSelected = this.state.itemSelectedId;
        if (Boolean(Helper.isObjectNotNull(listItem) && Helper.isObjectNotNull(idSelected))) {
            const object = listItem.find(item => item.id === idSelected);
            if (Helper.isObjectNotNull(object)) {
                if (Boolean(isShowCaptionValue)) {
                    caption = captionValue + ": " + Helper.getDesc(object);
                } else {
                    caption = Helper.getDesc(object);
                }
            }
        }
        return caption;
    }

    render() {
        const { caption, title, isShowCaptionValue, listItem, itemSelectedId,
            isRequired, onValueChange, errorMessage,  } = this.props;
        return (
            <View>
                {Boolean(title) &&
                    <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                        {
                            textAlign: 'left', marginBottom: 15
                        }]} >
                            {title}
                    </Text>
                }
                <View style={{ marginLeft: -16 }}>
                    <ListItem style={styles.listItemStyle}
                        onPress={(e) => this.setState({
                            isModalVisible: true
                        })}>
                        <View style={{ flexDirection: 'row', flex: 5 }}>
                            <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                            {
                                flex: 4.5, textAlign: 'left',
                                color: Helper.isObjectNotNull(itemSelectedId) ? 
                                theme.FONT_COLOR_TEXT_TITLE : theme.PLACEHOLDER_TEXT_COLOR,
                            }]} >
                                {this.getTextCaption(caption, isShowCaptionValue, listItem)}
                                {Boolean(isRequired && !Helper.isObjectNotNull(itemSelectedId))
                                        && <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                                        { color: theme.MANDATORY_LABEL_TEXT_COLOR }]}>*</Text>}
                            </Text>
                            <View style={{ alignItems: 'flex-end', flex: 0.5, justifyContent: 'center' }}>
                                <FontAwesomePro
                                    style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                                    size={20}
                                    color={theme.FONT_COLOR_TEXT_TITLE}
                                    icon={Icons.angleDown}
                                />
                            </View>
                        </View>
                    </ListItem>
                    {this.renderModal(caption, listItem, onValueChange)}
                </View>
                {Boolean(errorMessage) &&
                    <View style={{ flexDirection: 'row', flex: 5, paddingTop: 2 }}>
                        <FontAwesomePro
                            style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                            size={18}
                            color={theme.MANDATORY_LABEL_TEXT_COLOR}
                            icon={Icons.exclamationCircle}
                        />
                        <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, {
                            marginLeft: 2, flex: 4.5, color: theme.MANDATORY_LABEL_TEXT_COLOR
                        }]}>
                            {Helper.upperCaseFirstChar(errorMessage)}
                        </Text>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listItemStyle:{
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 4, 
        borderColor: 'rgba(202,202,216,0.5)', 
        paddingHorizontal: 16 
    }
});

export default withNavigation(CustomPickerDateButtonComponent);

