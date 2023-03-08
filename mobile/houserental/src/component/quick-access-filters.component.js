import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView } from "react-native";
import Helper from './../helper/helper';
import customTextStyleHelper from './../helper/custom-text-style.helper';
import theme from '../screens/theme/theme';
import { message } from '../I18n/i18n';
import { ASSET_QUICK_SEARCH } from '../store/redux/types';
import store from '../store';

/** */
export default function QuickAccessFiltersComponent(props) {
    const { hasBorder = false, onSelectTab } = props;

    let quickAccessFiltersVO = useSelector(state => state.quickSearch.quickAccessFilterVO);
    
    const [isShortTermSearch, setIsShortTermSearch] = useState(Boolean(quickAccessFiltersVO.isShortTerm));
    const [isLongTermSearch, setIsLongTermSearch] = useState(Boolean(quickAccessFiltersVO.isLongTerm));
    const [isWholeHouseSearch, setIsWholeHouseSearch] = useState(Boolean(quickAccessFiltersVO.isEntireHousing));
    const [isHouseTypeSearch, setIsHouseTypeSearch] = useState(Boolean(quickAccessFiltersVO.isTypeHouse));
    const [isFlatSharingTypeSearch, setIsFlatSharingTypeSearch] = useState(Boolean(quickAccessFiltersVO.isTypeFlatSharing));
    const [isApartmentTypeSearch, setIsApartmentTypeSearch] = useState(Boolean(quickAccessFiltersVO.isTypeApartment));

    useEffect(() => {
    }, [quickAccessFiltersVO]);

    return (
        <ScrollView horizontal={true} 
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: Helper.getVerticalScale(60), marginHorizontal: Helper.getHorizontalScale(16) }}>
            <View style={[styles.rentalTypeContainer, {
                borderBottomWidth: Boolean(hasBorder) ? 1 : 0
            }]}>
                <TouchableOpacity
                    style={[styles.baseRentalTypeBtn, Boolean(isShortTermSearch) ?
                        styles.activeTab : styles.inActiveTab, {
                        marginRight: 5
                    }]}
                    onPress={(e) => {
                        const isShortTerm = !Boolean(isShortTermSearch);
                        quickAccessFiltersVO.isShortTerm = isShortTerm;
                        onSelectTab && onSelectTab(quickAccessFiltersVO);
                        setIsShortTermSearch(isShortTerm);
                        store.dispatch({ type: ASSET_QUICK_SEARCH, payload: quickAccessFiltersVO });
                    }}
                >
                    <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, Boolean(isShortTermSearch) ?
                        styles.activeText : styles.inActiveText]}>{Helper.upperCaseFirstChar(message('hou.ren.shortterm'))}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.baseRentalTypeBtn, Boolean(isLongTermSearch) ?
                        styles.activeTab : styles.inActiveTab, {
                        marginRight: 5
                    }]}
                    onPress={(e) => {
                        const isLongTerm = !Boolean(isLongTermSearch);
                        quickAccessFiltersVO.isLongTerm = isLongTerm;
                        onSelectTab && onSelectTab(quickAccessFiltersVO);
                        setIsLongTermSearch(isLongTerm);
                        store.dispatch({ type: ASSET_QUICK_SEARCH, payload: quickAccessFiltersVO });
                    }}
                >
                    <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, Boolean(isLongTermSearch) ?
                        styles.activeText : styles.inActiveText]}>{Helper.upperCaseFirstChar(message('hou.ren.longterm'))}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.baseRentalTypeBtn, Boolean(isWholeHouseSearch) ?
                        styles.activeTab : styles.inActiveTab, {
                        marginRight: 5
                    }]}
                    onPress={(e) => {
                        const isEntireHousing = !Boolean(isWholeHouseSearch);
                        quickAccessFiltersVO.isEntireHousing = isEntireHousing;
                        onSelectTab && onSelectTab(quickAccessFiltersVO);
                        setIsWholeHouseSearch(isEntireHousing);
                        store.dispatch({ type: ASSET_QUICK_SEARCH, payload: quickAccessFiltersVO });
                    }}
                >
                    <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, Boolean(isWholeHouseSearch) ?
                        styles.activeText : styles.inActiveText]}>{message('hou.ren.property.shortstaydetail')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.baseRentalTypeBtn, Boolean(isHouseTypeSearch) ?
                        styles.activeTab : styles.inActiveTab, {
                        marginRight: 5
                    }]}
                    onPress={(e) => {
                        const isHouseType = !Boolean(isHouseTypeSearch);
                        quickAccessFiltersVO.isTypeHouse = isHouseType;
                        onSelectTab && onSelectTab(quickAccessFiltersVO);
                        setIsHouseTypeSearch(isHouseType);
                        store.dispatch({ type: ASSET_QUICK_SEARCH, payload: quickAccessFiltersVO });
                    }}
                >
                    <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, Boolean(isHouseTypeSearch) ?
                        styles.activeText : styles.inActiveText]}>{message('hou.ren.ads.type.house')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.baseRentalTypeBtn, Boolean(isFlatSharingTypeSearch) ?
                        styles.activeTab : styles.inActiveTab, {
                        marginRight: 5
                    }]}
                    onPress={(e) => {
                        const isFlatSharingType = !Boolean(isFlatSharingTypeSearch);
                        quickAccessFiltersVO.isTypeFlatSharing = isFlatSharingType;
                        onSelectTab && onSelectTab(quickAccessFiltersVO);
                        setIsFlatSharingTypeSearch(isFlatSharingType);
                        store.dispatch({ type: ASSET_QUICK_SEARCH, payload: quickAccessFiltersVO });
                    }}
                >
                    <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, Boolean(isFlatSharingTypeSearch) ?
                        styles.activeText : styles.inActiveText]}>{message('hou.ren.ads.type.flatsharing')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.baseRentalTypeBtn, Boolean(isApartmentTypeSearch) ?
                        styles.activeTab : styles.inActiveTab, {
                    }]}
                    onPress={(e) => {
                        const isApartmentType = !Boolean(isApartmentTypeSearch);
                        quickAccessFiltersVO.isTypeApartment = isApartmentType;
                        onSelectTab && onSelectTab(quickAccessFiltersVO);
                        setIsApartmentTypeSearch(isApartmentType);
                        store.dispatch({ type: ASSET_QUICK_SEARCH, payload: quickAccessFiltersVO });
                    }}
                >
                    <Text style={[customTextStyleHelper.TEXT_CAPTION_STYLE, Boolean(isApartmentTypeSearch) ?
                        styles.activeText : styles.inActiveText]}>{message('hou.ren.ads.type.apartment')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    baseRentalTypeBtn: {
        flexDirection: "row",
        height: Helper.getHorizontalScale(30),
        borderStyle: 'solid',
        borderRadius: 4,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Helper.getHorizontalScale(10),
    },
    activeText: {
        textAlign: 'center',
        color: theme.FONT_COLOR_TEXT_TITLE,
        fontFamily: theme.FONT_NAME_OVERPASS_SEMIBOLD,
        justifyContent: 'center',
        paddingTop: Helper.isIOSPlatform() ? 2 : 0
    },
    inActiveText: {
        textAlign: 'center',
        fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
        color: theme.FONT_COLOR_TEXT_TITLE,
        justifyContent: 'center',
        paddingTop: Helper.isIOSPlatform() ? 2 : 0
    },
    activeTab: {
        borderWidth: 1,
        borderColor: theme.FONT_COLOR_TEXT_TITLE,
        borderRadius: 4,
        backgroundColor: theme.SECONDARY_BG_COLOR,
        paddingTop: Helper.isIOSPlatform() ? 0 : 0
    },
    inActiveTab: {
        borderRadius: 4,
        borderWidth: 0,
        borderColor: 'rgba(202,202,216,0.5)',
        backgroundColor: theme.SECONDARY_BG_COLOR
    },
    rentalTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginVertical: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(202,202,216,0.5)",
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10
    }
});

