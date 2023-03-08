import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import FontAwesomePro, { Icons } from 'react-native-fonts-awesomepro';
import theme from '../screens/theme/theme';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import {
    Text,
    ListItem,
    View
} from 'native-base';
import ModalPickerComponent from './custom-picker.modal';
import { message } from '../I18n/i18n';
import Helper from '../helper/helper';

/** */
export default function CustomPickerButtonComponent(props) {
    const { caption, isShowCaptionValue, listItem, itemSelectedId,
        isRequired, onValueChange, errorMessage, isVerticalView,
        showLineSeparator = true, isBoldValue = true, isSearchable, searchBoxPlaceholder,
        placeholder = message('hou.ren.choosefromlist') } = props;

    const itemId = Boolean(Helper.isObjectNotNull(itemSelectedId)) ? itemSelectedId : null;
    const [itemIdSelected, setItemIdSelected] = useState(itemId);
    const [isModalVisible, setIsModalVisible] = useState(false);

    function renderModal(title, listItem, onValueChange) {
        if (Helper.isObjectNotNull(listItem) && listItem.length > 0) {
            return (
                <ModalPickerComponent
                    title={title}
                    listOption={listItem}
                    itemSelectedId={itemIdSelected}
                    isModalVisible={isModalVisible}
                    isRequired={isRequired}
                    isSearchable={isSearchable}
                    searchBoxPlaceholder={searchBoxPlaceholder}
                    onClose={(e) => {
                        setItemIdSelected(e)
                        setIsModalVisible(false)
                        onValueChange && onValueChange(e);
                    }}
                    onSave={(e) => {
                        setTimeout(() => {
                            setItemIdSelected(e)
                            setIsModalVisible(false)
                            onValueChange && onValueChange(e);
                        }, 500);
                    }} />
            );
        }
    }

    function getTextCaption(captionValue, isShowCaptionValue, listItem) {
        let caption = captionValue;
        const idSelected = itemIdSelected;
        if (Boolean(Helper.isObjectNotNull(listItem) && Helper.isObjectNotNull(idSelected))) {
            const object = listItem.find(item => item.id === idSelected);
            if (Helper.isObjectNotNull(object)) {
                if (Boolean(isShowCaptionValue)) {
                    caption = captionValue + ": " + Helper.getDesc(object);
                } else {
                    caption = Helper.upperCaseFirstChar(Helper.getDesc(object));
                }
            }
        }
        return caption;
    }

    return (
        <TouchableOpacity onPress={(e) => setIsModalVisible(true)}>
            <View style={{ marginHorizontal: Helper.getVerticalScale(-16) }}>
                {Boolean(isVerticalView) ?
                    <ListItem style={{ borderBottomWidth: 0 }}
                        onPress={(e) => setIsModalVisible(true)}>
                        <View style={{ flexDirection: 'row', flex: 5 }}>
                            <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                            {
                                flex: 4.5, textAlign: 'left'
                            }]} >
                                {caption}
                                {Boolean(isRequired)
                                    && <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                                    { color: theme.MANDATORY_LABEL_TEXT_COLOR }]}>*</Text>}
                            </Text>
                            <View style={{ alignItems: 'flex-end', flex: 0.5, justifyContent: 'center' }}>
                                <FontAwesomePro
                                    style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                                    size={20}
                                    color={theme.FONT_COLOR_TEXT_BODY}
                                    icon={Icons.angleRight}
                                />
                            </View>
                        </View>
                    </ListItem>
                    :
                    <ListItem style={{ borderBottomWidth: 0 }}
                        onPress={(e) => setIsModalVisible(true)}>
                        <View style={{ flexDirection: 'row', flex: 5 }}>
                            <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                            {
                                flex: 4.5, textAlign: 'left',
                                fontFamily: Boolean(Helper.isObjectNotNull(itemSelectedId) && isBoldValue) ?
                                    theme.FONT_NAME_OVERPASS_BOLD : theme.FONT_NAME_OVERPASS_REGULAR
                            }]} >
                                {getTextCaption(caption, isShowCaptionValue, listItem)}
                                {Boolean(isRequired && !Helper.isObjectNotNull(itemSelectedId))
                                    && <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                                    { color: theme.MANDATORY_LABEL_TEXT_COLOR }]}>*</Text>}
                            </Text>
                            <View style={{ alignItems: 'flex-end', flex: 0.5, justifyContent: 'center' }}>
                                <FontAwesomePro
                                    style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                                    size={20}
                                    color={theme.FONT_COLOR_TEXT_BODY}
                                    icon={Icons.angleRight}
                                />
                            </View>
                        </View>
                    </ListItem>
                }
                {renderModal(caption, listItem, onValueChange)}
            </View>
            <View>
                {Boolean(isVerticalView) &&
                    <Text numberOfLines={1} style={[customTextStyleHelper.TITLE_TEXT_H3_STYLE,
                    {
                        color: Helper.isObjectNotNull(itemSelectedId) ?
                            theme.FONT_COLOR_TEXT_BODY : theme.PLACEHOLDER_TEXT_COLOR,
                        fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                    }]}>
                        {Helper.isObjectNotNull(itemSelectedId) ?
                            Helper.upperCaseFirstChar(getTextCaption(caption, false, listItem))
                            :
                            placeholder
                        }
                    </Text>
                }
            </View>
            {Boolean(showLineSeparator) &&
                <View style={[customTextStyleHelper.LINE_SEPARATOR_STYLE,
                { marginTop: Helper.getVerticalScale(Helper.isIOSPlatform() ? 15 : 20) }]} />
            }
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
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
});
