import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Modal
} from 'react-native';
import {
    Container,
    View,
    Text,
    ListItem,
    List,
    Input,
} from "native-base";
import FontAwesomePro, { Icons } from 'react-native-fonts-awesomepro';
import theme from '../screens/theme/theme';
import { message } from '../I18n/i18n';
import Helper from '../helper/helper';
import CustomHeaderLeftTextComponent from '../component/custom-header-left-text.component';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import { debounce } from "lodash";

/** */
export default function CustomPickerModal(props) {

    const { title, listOption, itemSelectedId, isRequired, isModalVisible, onClose, onSave, isSearchable, searchBoxPlaceholder } = props;

    const oldItemSelectedId = itemSelectedId;

    const itemId = Boolean(Helper.isObjectNotNull(itemSelectedId)) ? itemSelectedId : null;
    const [itemIdSelected, setItemIdSelected] = useState(itemId);
    const [searchText, setSearchText] = useState(Helper.EMPTY);
    const [listOptions, setListOptions] = useState(listOption);

    const debounceHandler = useCallback(debounce(filterListItem, 500), []);

    const isItemSelected = (item, itemSelectedId) => {
        return Boolean((itemIdSelected === null && item.id === itemSelectedId)
            || itemIdSelected === item.id);
    }

    function onSelect(selectItem) {
        if (selectItem !== null) {
            if (Boolean(!isRequired) && Boolean(selectItem.id == oldItemSelectedId)) {
                setItemIdSelected(null)
                onSave(null)
            } else {
                setItemIdSelected(selectItem.id)
                onSave(selectItem.id)
            }
        }
    }

    function filterListItem(text) {
        let filterList = listOptions.filter(option => Helper.getDesc(option).toLowerCase().includes(text.toLowerCase()));
        setListOptions(filterList);        
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={(e) => {
                setItemIdSelected(oldItemSelectedId)
                onClose(oldItemSelectedId)
            }}
        >
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }}
            >
                <View style={{ width: '100%', height: '100%' }}>
                    <Container style={{ backgroundColor: theme.OFF_WHITE }}>
                        <CustomHeaderLeftTextComponent title={Boolean(title) ?
                            title : message('hou.ren.pleaseselect')}
                            onBackPress={(e) => {
                                setItemIdSelected(oldItemSelectedId)
                                onClose(oldItemSelectedId);
                            }}
                        />
                        {
                            Boolean(isSearchable) &&
                            <View>
                                <View style={{ flexDirection: 'row' , backgroundColor: theme.WHITE, paddingHorizontal: Helper.getHorizontalScale(32) }}>
                                    <View style={{ justifyContent: 'center', width: "10%", alignItems: 'flex-start' }}>
                                        <FontAwesomePro
                                            style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                                            size={Helper.getFontSizeScale(20)}
                                            color={theme.FONT_COLOR_LINK}
                                            icon={Icons.search}
                                        />
                                    </View>
                                    <Input
                                        returnKeyType={'done'}
                                        placeholder={searchBoxPlaceholder}
                                        placeholderTextColor={theme.FONT_COLOR_TEXT_TITLE_2}
                                        maxLength={100}
                                        value={searchText}
                                        onChangeText={(text) => {
                                            setSearchText(text);
                                            debounceHandler(text);
                                        }}
                                        style={{
                                            fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                                            backgroundColor: theme.WHITE,
                                            color: theme.FONT_COLOR_TEXT_BODY,
                                            fontSize: customTextStyleHelper.TEXT_FONT_SIZE_PARAGRAPH,
                                            textTransform: 'none', width: "90%"
                                        }}
                                    />
                                </View>
                                <View style={[customTextStyleHelper.LINE_SEPARATOR_STYLE, { marginHorizontal: Helper.getHorizontalScale(32) }]} />
                            </View>
                        }
                        <List dataArray={listOptions} style={{ backgroundColor: theme.OFF_WHITE }}
                            renderRow={(item) =>
                                <View style={{ marginHorizontal: 16 }}>
                                    <View>
                                        <ListItem key={item.id} style={{ borderBottomWidth: 0 }}
                                            onPress={(e) => onSelect(item)}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[customTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                                                {
                                                    flex: 4.4, justifyContent: 'center', alignSelf: 'center',
                                                    textAlign: 'left', fontFamily: isItemSelected(item, itemSelectedId) ?
                                                        theme.FONT_NAME_OVERPASS_BOLD : theme.FONT_NAME_OVERPASS_REGULAR
                                                }]} >
                                                    {Helper.getDesc(item)}
                                                </Text>
                                                <View style={{ alignItems: 'flex-end', flex: 0.6, justifyContent: 'center' }}>
                                                    <View
                                                        style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            height: Helper.getVerticalScale(32),
                                                            width: Helper.getVerticalScale(32),
                                                            borderRadius: 50,
                                                            backgroundColor: Boolean(isItemSelected(item, itemSelectedId)) ?
                                                                theme.FONT_COLOR_LINK : 'rgba(202,202,216,0.3)',
                                                        }}
                                                    >
                                                        {Boolean(isItemSelected(item, itemSelectedId)) &&
                                                            <FontAwesomePro
                                                                style={{
                                                                    fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
                                                                }}
                                                                size={Helper.getFontSizeScale(14)}
                                                                color={theme.WHITE}
                                                                icon={Icons.check}
                                                            />
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </ListItem>
                                    </View>
                                    <View style={[customTextStyleHelper.LINE_SEPARATOR_STYLE, { marginHorizontal: 16 }]} />
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}>
                        </List>
                    </Container>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
});