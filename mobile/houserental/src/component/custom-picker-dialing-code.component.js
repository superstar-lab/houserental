import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import FontAwesomePro, { Icons } from 'react-native-fonts-awesomepro';
import theme from '../screens/theme/theme';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import { Card, CardItem, Label } from 'native-base';
import Helper from '../helper/helper';

const CustomPickerDialingCodeComponent = ({title, children }) => {
    const [open, setOpen] = useState(false);
    const animatedController = useRef(new Animated.Value(0)).current;
    const [bodySectionHeight, setBodySectionHeight] = useState(130);

    const bodyHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bodySectionHeight],
    });

    const toggleListItem = () => {
        if (open) {
            Animated.timing(animatedController, {
                duration: 300,
                toValue: 0,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            }).start();
        } else {
            Animated.timing(animatedController, {
                duration: 300,
                toValue: 1,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            }).start();
        }
        setOpen(!open);
    };

    return (
        <View>
            <TouchableOpacity onPress={() => toggleListItem()}>
                <View style={styles.titleContainer}>
                    <Animated.View style={{ flexDirection: 'row', flex: Boolean(open) ? 0 : 0 }}>
                        {
                            Boolean(title) ?
                            <Text style={[customTextStyleHelper.TITLE_TEXT_H3_STYLE,
                                {   flex:1,
                                    textAlign: 'left', marginLeft: -8,
                                    color: theme.FONT_COLOR_TEXT_BODY,
                                    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                                }]}>
                                    {title}
                            </Text>
                            :
                            <Text style={[customTextStyleHelper.TITLE_TEXT_H3_STYLE,
                                {   flex:1,
                                    textAlign: 'left', marginLeft: -8,
                                    color: theme.BORDER_COLOR,
                                    fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                                }]}>
                                    {'+33'}
                            </Text>

                        }
                        <FontAwesomePro
                            style={{
                                fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR,
                                paddingTop: Helper.isIOSPlatform() ? 3 : 6,
                            }}
                            size={customTextStyleHelper.TEXT_FONT_SIZE_H3}
                            color={theme.FONT_COLOR_TEXT_BODY}
                            icon={Boolean(open) ? Icons.angleUp : Icons.angleDown}
                        />
                    </Animated.View>
                </View>
            </TouchableOpacity>
            <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
                <View
                    style={styles.bodyContainer}
                    onLayout={event =>
                        setBodySectionHeight(event.nativeEvent.layout.height)
                    }>
                    <Card transparent style={{
                        overflow: 'hidden',
                    }}>
                        <CardItem cardBody style={{
                            borderColor: theme.BORDER_COLOR,
                            borderTopColor: theme.BORDER_COLOR,
                            overflow: 'hidden'
                        }}>
                            {children}
                        </CardItem>
                    </Card>
                </View>
            </Animated.View>
        </View>
    );
};
export default CustomPickerDialingCodeComponent;

const styles = StyleSheet.create({
    bodyBackground: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingLeft: 8,
    },
    bodyContainer: {
        marginTop: 5,
        marginHorizontal: -2,
        position: 'absolute',
        zIndex: 0,
    },
});