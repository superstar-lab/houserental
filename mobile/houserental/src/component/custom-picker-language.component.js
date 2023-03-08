import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Image
} from 'react-native';
import FontAwesomePro, { Icons } from 'react-native-fonts-awesomepro';
import theme from '../screens/theme/theme';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import { Card, CardItem, Label } from 'native-base';
import Helper from '../helper/helper';

const CustomPickerLanguageComponent = ({ imageUrl, title, children }) => {
    const [open, setOpen] = useState(false);
    const animatedController = useRef(new Animated.Value(0)).current;
    const [bodySectionHeight, setBodySectionHeight] = useState(115);

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
                    <Animated.View style={{ flexDirection: 'row' }}>
                        {Boolean(imageUrl) &&
                            <Image source={imageUrl} style={{ width: 20, height: 20, }} />
                        }
                        <Text style={[customTextStyleHelper.TITLE_TEXT_H4_STYLE,
                        {
                            textAlign: 'left', paddingLeft: 5,
                            color: theme.FONT_COLOR_TEXT_BODY,
                            fontFamily: theme.FONT_NAME_OVERPASS_REGULAR,
                        }]}>
                            {title + Helper.SPACE + Helper.SPACE}
                        </Text>
                        <FontAwesomePro
                            style={{
                                fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID,
                                paddingTop: 3
                            }}
                            size={customTextStyleHelper.TEXT_FONT_SIZE_H4}
                            color={theme.FONT_COLOR_LINK}
                            icon={Boolean(open) ? Icons.angleUp : Icons.angleDown}
                        />
                    </Animated.View>
                </View>
            </TouchableOpacity>
            <Animated.View style={[styles.bodyBackground, { height: bodyHeight, }]}>
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
export default CustomPickerLanguageComponent;

const styles = StyleSheet.create({
    bodyBackground: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
        width: Helper.getHorizontalScale(170),
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    bodyContainer: {
        width: Helper.getHorizontalScale(170),
        marginTop: 0,
        position: 'absolute',
        zIndex: 1,
    },
});