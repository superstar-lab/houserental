import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Image, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Title } from "native-base";
import theme from "../screens/theme/theme";
import { message } from "../I18n/i18n";
import Helper from '../helper/helper';
import FontAwesomePro, { Icons } from "react-native-fonts-awesomepro";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import onboardingTextStyleHelper from '../helper/onboarding-text-style.helper';
import customTextStyleHelper from "../helper/custom-text-style.helper";
import LocationFilterHistoryVO from '../helper/location-filter-history.vo';
import AsyncStorage from "@react-native-community/async-storage";
import QuickAccessFiltersVO from "./vo/quick-access-filters.vo";
import QuickAccessFiltersComponent from "./quick-access-filters.component";
import moment from 'moment';
import AssetFilterHelper from "../helper/asset-filter.helper";

/**
 * -onBackAutoSearch:fonction called when clicked back button
 * -onLocationSelect:fonction called when suggestion selected
 * -onFilterPress:fonction called when clicked filter button
 * -locationTextDidChange:fonction called when text field change value
 * -onCurrentPositionPress:fonction called when clicked Around me button
 * -activateTab:fonction called when select rental type buttons
 * -currentPlace:fonction called when suggestion selected
 * -showExtratOptions(Boolean):to show rental type buttons
 * -showFilter(Boolean): to show the filter button
 * example of use:
 *  <View style={{width:"90%" ,alignSelf:"center",marginTop:20,position:"absolute"}}>
                        <SearchBarFilter 
                        showExtratOptions={true}
                        showFilter={true}
                        currentPlace=""
                        onBackAutoSearch={(val) => { console.log("onBackAutoSearch ===",val)}}
                         onLocationSelect={(data, details) => { console.log("onLocationSelect ===",data);console.log("onLocationSelect ===",details)}}
                          onFilterPress={(val) => { console.log("onFilterPress ===",val)}}
                          locationTextDidChange={(val) => { console.log("locationTextDidChange ===",val)}} 
                          activateTab={(val) => { console.log("activateTab ===",val)}}
                          onCurrentPositionPress={(val) => { console.log("onCurrentPositionPress ===",val)}}
                        ></SearchBarFilter>
                    
                    </View>
 */
export default class SearchBarFilter extends Component {

    constructor(props) {
        super(props)
        this.searchText = "";
        this.locationFilterHistoryVO = null;
        this.locationFilterHistories = [];
        this.listAssetType = [];
        this.ref = React.createRef();
        this.state = {
            locationText: Helper.EMPTY,
            currentPlace: this.props.currentPlace,
            isDisplayListView: false,
            isDisplayBackImage: false,
            isSearching: false,
            isFocused: false,
            isLoadingHistory: false,
            locationFilterHistoriesToDisplay: [],
        }
    }
    async componentDidMount() {
        this.locationFilterHistoryVO = null;
        this.quickAccessFiltersVO = new QuickAccessFiltersVO();
        this.getSearchHistory();
        if (this.props.isFocused) {
            this.ref.current.triggerFocus();
        }
    }

    async getSearchHistory() {
        let listAssetFilter = [];
        let secUser = null;
        let people = null;
        this.setState({ isLoadingHistory: true });
        await AsyncStorage.getItem(Helper.USER_KEY).then((value) => {
            secUser = JSON.parse(value);
        });
        await Helper.REF_DATA_SERVICE.getReaAssetTypes()
            .then(res => res.json())
            .then((data) => {
                this.listAssetType = data;
            })
            .catch(console.log);
        if (Helper.isObjectNotNull(secUser)) {
            await Helper.PEOPLE_SERVICE.getPeopleByUserId(secUser.id)
                .then(res => res.json())
                .then((data) => {
                    if (data.status == Helper.ERROR_TECHNICAL_STATUS) {
                        listAssetFilter = [];
                    } else {
                        people = data;
                    }
                }).catch((err) => {
                    console.log(err.message);
                    listAssetFilter = [];
                });
            if (Helper.isObjectNotNull(people)) {
                await Helper.REA_ASSET_SERVICE.getListReaAssetFilter(people.id, 0, 5)
                    .then(res => res.json())
                    .then((data) => {
                        listAssetFilter = data;
                    })
                    .catch(err => {
                        console.log(err.message);
                        listAssetFilter = [];
                    })
            }
        } else {
            await AsyncStorage.getItem(Helper.ASSET_FILTER_MODEL_KEY).then((value) => {
                const listAssetFilterLocal = JSON.parse(value);
                if (Helper.isObjectNotNull(listAssetFilterLocal) && listAssetFilterLocal.length > 0) {
                    listAssetFilterLocal.forEach(obj => {
                        const shortTermAdvModel = obj.advanceFilterShortTermDTO;
                        if (!Boolean(Helper.isObjectNotNull(shortTermAdvModel) && Helper.isObjectNotNull(shortTermAdvModel.startDate)
                            && moment(new Date(shortTermAdvModel.startDate)).isBefore(moment.now()))) {
                            listAssetFilter.push(obj);
                        }
                    });
                    if (!Helper.isObjectNotNull(listAssetFilter)) {
                        listAssetFilter = [];
                    }
                    listAssetFilter = listAssetFilter.slice(0, 5);
                }
            });
        }
        this.locationFilterHistories = listAssetFilter;
        this.setState({ locationFilterHistoriesToDisplay: listAssetFilter, isLoadingHistory: false });
    }

    locationTextDidChange = (locationText) => {
        this.props.locationTextDidChange(locationText)
    }
    renderSearchLayout(onTextFocus, onBackAutoSearch, onLocationSelect, onFilterPress, showFilter) {
        return (
            <GooglePlacesAutocomplete
                ref={this.ref}
                placeholder={message('hou.ren.searchplaceholder')}
                placeholderTextColor={theme.FONT_COLOR_TEXT_TITLE_2}
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                keyboardAppearance={'light'}
                listViewDisplayed={this.state.isDisplayListView}
                fetchDetails={true}
                renderDescription={row => row.description}
                renderRow={results => this.renderGooglePlacesAutocompleteItem(results)}
                onPress={(data, details) => {
                    //onsole.log("onPressGooglePlacesAutocompleteItem", data);
                    // this.setState({ isSearching: false })
                    // onLocationSelect(data, details);
                    this.onPressGooglePlacesAutocompleteItem(data, details, onLocationSelect)
                }}
                textInputProps={{
                    onFocus: () => {
                        this.setState({ isDisplayListView: true, isDisplayBackImage: true, isFocused: true });
                        onTextFocus && onTextFocus()
                    },
                    onBlur: () => {
                        this.setState({ isDisplayListView: false, isDisplayBackImage: false, isFocused: false });
                    },
                    onChangeText: (text) => {
                        // this.setState({
                        //     isShowSearchHistory: Boolean(text.length <= 1)
                        // })
                        this.searchText = text;
                        this.setState({ isSearching: Boolean(text.length > 1) })

                        this.locationTextDidChange(text)
                    },
                    isFocused: (isFocused) => {

                        this.setState({ isSearching: isFocused, });

                    }
                }}

                enablePoweredByContainer={false}

                getDefaultValue={() => this.state.locationText}

                query={{
                    key: Helper.GOOGLE_SEARCH_LOCATION_API_KEY,
                    language: 'en',
                }}

                styles={{
                    container: {
                        width: '100%',
                        //  height: 50,
                        // borderTopColor: theme.BORDER_COLOR,
                        // borderTopColor: 0,
                        // borderBottomWidth: 0,

                        flex: 1,
                        zIndex: 998,
                    },
                    textInputContainer: {
                        width: '100%',
                        // height: '100%',
                        backgroundColor: theme.OFF_WHITE,
                        // backgroundColor: "yellow",
                        borderWidth: 0,
                        borderColor: theme.OFF_WHITE,

                        paddingTop: 3,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        // borderTopColor: theme.BORDER_COLOR,
                        // borderBottomColor: theme.BORDER_COLOR,
                    },
                    textInput: {
                        backgroundColor: theme.OFF_WHITE,
                        marginLeft: 0,
                        fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                        fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H4,
                        color: theme.FONT_COLOR_TEXT_BODY
                    },
                    description: {
                        fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
                        fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H4,
                    },
                    listView: {
                        position: 'absolute',
                        marginTop: 50,
                        backgroundColor: theme.WHITE,
                        elevation: 0,
                        zIndex: 1000
                    },
                    separator: {
                        opacity: 0
                    }
                }}

                currentLocation={false}
                currentLocationLabel={message('hou.ren.currentlocation')}
                nearbyPlacesAPI='GooglePlacesSearch'

                GooglePlacesSearchQuery={{
                    rankby: 'distance',
                    type: 'cafe'
                }}

                GooglePlacesDetailsQuery={{
                    fields: 'geometry,address_components',
                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_1']}
                // dpredefinedPlaces={[this.state.currentPlace]}

                debounce={200}
                renderLeftButton={(e) => <TouchableOpacity onPress={(e) => {
                    this.ref.current.triggerBlur();
                    this.setState({ isDisplayListView: false, isDisplayBackImage: false, isFocused: false });
                    onBackAutoSearch && onBackAutoSearch(e)
                }}
                    style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <FontAwesomePro
                        style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR, marginVertical: 10 }}
                        size={customTextStyleHelper.TEXT_FONT_SIZE_H3}
                        color={theme.FONT_COLOR_LINK}
                        icon={this.state.isDisplayBackImage ? Icons.chevronLeft : Icons.search}
                    />
                </TouchableOpacity>
                }
                renderRightButton={(e) => showFilter ? this.renderFilterButton(3, onFilterPress) : null}
            />
        )
    }
    onPressGooglePlacesAutocompleteItem = (data, details, onLocationSelect) => {
        if (details.geometry == undefined) {
            console.log("Can not get current location");
            this.locationFilterHistoryVO = null;
        } else {
            this.locationFilterHistoryVO = new LocationFilterHistoryVO();
            this.locationFilterHistoryVO.data = data;
            this.locationFilterHistoryVO.details = details;
        }
        if (!this.locationFilterHistories || this.locationFilterHistories == undefined) {
            this.locationFilterHistories = []
        }
        if (Helper.isObjectNotNull(this.locationFilterHistoryVO)) {
            if (Boolean(data.description == message('hou.ren.aroundme'))) {
                onLocationSelect && onLocationSelect(this.locationFilterHistoryVO);
            } else {
                Helper.handleSaveLocationFilterHistory(data, details);
                onLocationSelect && onLocationSelect(this.locationFilterHistoryVO);

                if (this.locationFilterHistories.length >= 5) {
                    this.locationFilterHistories.pop();
                }
                this.locationFilterHistories.unshift(this.locationFilterHistoryVO);
            }
        }
        // console.log("onPressGooglePlacesAutocompleteItem", data);
        this.setState({ isSearching: false, locationFilterHistoriesToDisplay: this.locationFilterHistories ? this.locationFilterHistories : [] })
        // Helper.handleSaveLocationFilterHistory(data, details);
        // onLocationSelect && onLocationSelect(data, details);
    }
    renderGooglePlacesAutocompleteItem = (data) => {

        return (

            <View style={{ flexDirection: 'row' }}>
                {Boolean(data.description == message('hou.ren.aroundme')) ?
                    <View style={{ paddingRight: 16 }}>
                        <Image style={{
                            width: 18, height: 18,
                            tintColor: theme.BORDER_COLOR, resizeMode: 'contain'
                        }}
                            source={require('../assets/rentals/icons/icon_around-me.png')} />
                    </View>
                    :
                    <FontAwesomePro
                        style={{
                            fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR,
                            paddingRight: 16
                        }}
                        size={customTextStyleHelper.TEXT_FONT_SIZE_H5}
                        color={theme.BORDER_COLOR}
                        icon={Icons.mapMarkerAlt}
                    />
                }
                <Text style={{
                    color: theme.FONT_COLOR_TEXT_BODY,
                    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                    fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H4,
                    lineHeight: Helper.isIOSPlatform() ? 0 : Helper.getVerticalScale(20),
                }}>
                    {data.description}
                </Text>
            </View>

        );
    }
    renderFilterButton = (marginTop, onFilterPress) => {
        return <TouchableOpacity style={[styles.searchButton,
        { marginTop: marginTop }]}
            onPress={(e) => { onFilterPress && onFilterPress(e) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <FontAwesomePro
                    style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR, paddingHorizontal: 10, paddingVertical: 5 }}
                    size={customTextStyleHelper.TEXT_FONT_SIZE_H4}
                    color={theme.FONT_COLOR_LINK}
                    icon={Icons.slidersH}
                />
                <Title style={{
                    fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H4,
                    color: theme.FONT_COLOR_TEXT_TITLE_2, fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
                    paddingTop: 3
                }}>
                    {message('hou.ren.filter')}
                </Title>
            </View>
        </TouchableOpacity>
    }

    renderSuggestion(searchHistory, onUserLocationSelect, onCurrentPositionPress) {
        if (!this.locationFilterHistories || (this.locationFilterHistories && this.locationFilterHistories.length < 1)) {
            this.locationFilterHistories = searchHistory
        }
        if (this.locationFilterHistories && this.locationFilterHistories.length > 0) {
            this.state.locationFilterHistoriesToDisplay = this.locationFilterHistories
        }
        return (
            <View style={styles.suggestionContainer}>
                <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 10 }}
                    onPress={(e) => {
                        this.ref.current.triggerBlur();
                        this.setState({ isSearching: false, isFocused: false })
                        onCurrentPositionPress && onCurrentPositionPress(this.state.currentPlace);
                    }} >
                    <Image style={{ width: Helper.getHorizontalScale(18), height: Helper.getHorizontalScale(18), resizeMode: 'contain', tintColor: theme.BORDER_COLOR }}
                        source={require('../assets/rentals/icons/icon_around-me.png')} />
                    <Text style={[onboardingTextStyleHelper.TEXT_PARAGRAPH_STYLE,
                    { paddingLeft: 5, lineHeight: Helper.isIOSPlatform() ? 0 : 22, marginBottom: 10 }]}>{message('hou.ren.aroundme')}</Text>
                </TouchableOpacity>
                {
                    this.state.isLoadingHistory &&
                    <View style={{ marginVertical: 10 }}>
                        <ActivityIndicator animating={this.state.isLoadingHistory} color={theme.FONT_COLOR_LINK} size='small' />
                    </View>
                }
                { this.state.locationFilterHistoriesToDisplay && this.state.locationFilterHistoriesToDisplay.length > 0 &&
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE, { color: theme.FONT_COLOR_TEXT_TITLE }]}>
                            {message('hou.ren.recent')}
                        </Text>
                        {
                            this.state.locationFilterHistoriesToDisplay.map((obj, index) => {
                                let subTitle = '';
                                if (Helper.isObjectNotNull(obj.advanceFilterShortTermDTO)) {
                                    let startDate = obj.advanceFilterShortTermDTO.startDate;
                                    let endDate = obj.advanceFilterShortTermDTO.endDate;
                                    let sleepingCapacity = obj.advanceFilterShortTermDTO.sleepingCapacity;
                                    if (Helper.isObjectNotNull(startDate) && Helper.isObjectNotNull(endDate)) {
                                        let sameMonth = moment(startDate).isSame(moment(endDate), 'month');
                                        if (sameMonth) {
                                            subTitle = moment(startDate).format('DD') + "-" + moment(endDate).format('DD')
                                                + Helper.SPACE + message("hou.ren.calendar.month." + moment(startDate).format("MMM").toLowerCase()).toLowerCase()
                                        } else {
                                            subTitle = moment(startDate).format('DD') + Helper.SPACE + message("hou.ren.calendar.month." + moment(startDate).format("MMM").toLowerCase()).toLowerCase()
                                                + " - " + moment(endDate).format('DD') + Helper.SPACE + message("hou.ren.calendar.month." + moment(endDate).format("MMM").toLowerCase()).toLowerCase()
                                        }
                                    }
                                    if (Helper.isObjectNotNull(sleepingCapacity) && sleepingCapacity > 0) {
                                        if (subTitle !== Helper.EMPTY) {
                                            subTitle += ", ";
                                        }
                                        subTitle += sleepingCapacity + Helper.SPACE + message(Helper.getNbTraveller(sleepingCapacity)).toLowerCase();
                                    }
                                } else if (Helper.isObjectNotNull(obj.advanceFilterLongTermDTO)) {
                                    let listAssetTypeId = obj.advanceFilterLongTermDTO.listAssetTypeId
                                    if (Helper.isObjectNotNull(listAssetTypeId) && listAssetTypeId.length > 0) {
                                        subTitle = AssetFilterHelper.getAssetTypeDesc(listAssetTypeId, this.listAssetType);
                                    }

                                    let minRentAmount = obj.advanceFilterLongTermDTO.minRentAmount;
                                    let maxRentAmount = obj.advanceFilterLongTermDTO.maxRentAmount;
                                    if (Helper.isObjectNotNull(minRentAmount) && Helper.isObjectNotNull(maxRentAmount)) {
                                        subTitle += minRentAmount + "-" + maxRentAmount + (maxRentAmount == 5000 ? "+" : "") + " eur.";
                                    }
                                }
                                return <TouchableOpacity key={index}
                                    onPress={(e) => {
                                        this.ref.current.triggerBlur();
                                        this.setState({ isSearching: false, isFocused: false })
                                        onUserLocationSelect && onUserLocationSelect(obj);
                                    }}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, paddingTop: 5 }}>
                                        <View style={{ paddingTop: 4, flex: 1 }}>
                                            <FontAwesomePro
                                                style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                                                size={Helper.getVerticalScale(16)}
                                                color={theme.BORDER_COLOR}
                                                icon={Icons.history}
                                            />
                                        </View>
                                        <View style={{ flex: 14 }}>
                                            <Text numberOfLines={1} style={{
                                                color: theme.FONT_COLOR_TEXT_BODY,
                                                fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                                                fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H4
                                            }}>
                                                {obj.locationText}
                                            </Text>
                                            {
                                                subTitle !== Helper.EMPTY &&
                                                <Text numberOfLines={1} style={{
                                                    color: theme.PLACEHOLDER_TEXT_COLOR,
                                                    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                                                    fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H5
                                                }}>
                                                    {subTitle}
                                                </Text>
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                }

            </View>

        )
    }
    render() {
        const { onTextFocus, onBackAutoSearch, onLocationSelect, onUserLocationSelect, onFilterPress, showExtratOptions,
            showFilter, searchHistory, onCurrentPositionPress, isTabFilterTop, hasMarginTop, activateTab } = this.props;
        return (

            <View style={{ backgroundColor: theme.WHITE, marginBottom: Helper.getVerticalScale(-15) }} >

                {Boolean(showExtratOptions && isTabFilterTop && !this.state.isFocused)
                    ? <QuickAccessFiltersComponent hasBorder={true} onSelectTab={(value) => activateTab && activateTab(value)} /> : null}
                <View style={{
                    borderRadius: 6,
                    marginHorizontal: Helper.getHorizontalScale(16),
                    marginTop: Helper.getVerticalScale(Boolean(Helper.isIOSPlatform() && hasMarginTop) ? 37.5 : 8),
                    height: Helper.getVerticalScale(this.state.isSearching ? 300 : 50),
                    borderWidth: Boolean(showExtratOptions && !isTabFilterTop) ? 1 : 0,
                    borderColor: 'rgba(202,202,216,0.5)'
                }}>
                    {this.renderSearchLayout(onTextFocus, onBackAutoSearch, onLocationSelect, onFilterPress, showFilter)}
                </View>
                {Boolean(showExtratOptions && !isTabFilterTop && !this.state.isFocused)
                    ? <QuickAccessFiltersComponent hasBorder={false} onSelectTab={(value) => activateTab && activateTab(value)} /> : null}

                {this.state.isFocused && this.searchText.length < 2 ? this.renderSuggestion(searchHistory, onUserLocationSelect, onCurrentPositionPress) : null}
            </View>

        )

    }

}

const styles = StyleSheet.create({
    searchButton: {
        textTransform: 'capitalize',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftColor: 'rgba(202,202,216,0.5)',
        borderLeftWidth: 2,
        paddingLeft: 5,
        paddingRight: 15,
        height: 35,
    },
    suggestionContainer: {
        marginTop: 5,
        borderTopColor: 'rgba(202,202,216,0.5)',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        marginHorizontal: 16
    },
});