import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,

} from 'react-native';
import {
    ListItem,
    Body,
} from "native-base";
import { withNavigation } from 'react-navigation';
import theme from '../theme/theme';
import Helper from "../../helper/helper";
import customTextStyleHelper from '../../helper/custom-text-style.helper';

function ChatHeader(props) {
    const { chatHeaderObj } = props;
    let imageUrl = null;
    let title = Helper.EMPTY;
    let address = Helper.EMPTY;
    let detail = Helper.EMPTY;
    if (Helper.isObjectNotNull(chatHeaderObj)) {
        imageUrl = Helper.isValidUrl(chatHeaderObj.imageUrl) ? chatHeaderObj.imageUrl : null;
        title = chatHeaderObj.title;
        address = chatHeaderObj.address;
        detail = chatHeaderObj.detail;
    }
    return (
        <ListItem avatar style={styles.itemContainer}>
            {/* {console.log('hello \n',props)} */}
            <View style={styles.leftContainer} >
                {Helper.isValidUrl(imageUrl) &&
                    <Image style={styles.itemImage}
                        source={
                            { uri: imageUrl }
                        }
                    />
                }
            </View>
            <Body style={styles.body}>
                <View style={styles.rowSection}>

                    <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE,
                    { color: theme.FONT_COLOR_LINK }]} numberOfLines={1} ellipsizeMode={'tail'}>
                        {title}
                    </Text>

                    <Text style={styles.location} numberOfLines={1} ellipsizeMode={'tail'}>
                        {address}
                    </Text>

                    <Text style={[customTextStyleHelper.TITLE_TEXT_H5_STYLE,
                    {
                        color: theme.FONT_COLOR_TEXT_TITLE,
                        fontFamily: theme.FONT_NAME_OVERPASS_REGULAR
                    }]} numberOfLines={1} ellipsizeMode={'tail'}>
                        {detail}
                    </Text>

                </View>
            </Body>
        </ListItem>
    );
};
const styles = StyleSheet.create({
    itemContainer: {

        marginRight: Helper.getHorizontalScale(0),
        marginLeft: Helper.getHorizontalScale(0),
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.SECONDARY_BG_COLOR,
        backgroundColor: theme.WHITE,
        paddingVertical: Helper.getVerticalScale(Helper.isAndroidPlatform() ? 15 : 0),
    },
    body: {
        alignContent: 'center',
        borderBottomWidth: 0,
        padding: 0,
        marginLeft: '3%',
    },
    leftContainer: {

        justifyContent: 'center',
        paddingTop: Helper.getVerticalScale(0),
        paddingBottom: Helper.getVerticalScale(0),
        marginBottom: Helper.getVerticalScale(0),
        borderBottomWidth: 0,
    },
    location: {
        fontSize: customTextStyleHelper.TEXT_FONT_SIZE_H5,
        fontFamily: theme.FONT_NAME_OVERPASS_BOLD,
        color: theme.FONT_COLOR_TEXT_TITLE_2
    },

    rowSection: {
        flex: Helper.isAndroidPlatform() ? 1 : 0,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 0,
    },
    itemImage: {
        alignSelf: 'center',
        backgroundColor: theme.SECONDARY_BG_COLOR,
        width: Helper.getHorizontalScale(85),
        height: Helper.getVerticalScale(65),
        borderRadius: 6,
        resizeMode: "cover",
    },

});
export default withNavigation(ChatHeader);