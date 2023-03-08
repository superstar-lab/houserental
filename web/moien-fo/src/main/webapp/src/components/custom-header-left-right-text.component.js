import React from 'react';

import { withRouter } from 'react-router-dom';
import theme from '../theme/theme';
import Helper from '../helper/helper';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import { Icon } from 'rsuite';
import './style-components.css';

/** */
class CustomHeaderLeftRightText extends React.Component {

    render() {
        this.helper = new Helper();
        const { title, isHideBack, onBackPress, rightTitle, errorMessage } = this.props;
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    {!isHideBack &&
                        <button className= 'button-back'
                            onClick={(e) => onBackPress ? onBackPress(e) : this.props.navigation.goBack(null)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ marginRight: 10 }}>
                                    <Icon 
                                        style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID }}
                                        size={18}
                                        size='2x' color={theme.BORDER_COLOR} 
                                        color={theme.FONT_COLOR_TEXT_TITLE}
                                        icon= 'angle-left'
                                    />
                                </div>
                                <div style={{ fontSize: 19, fontFamily: theme.FONT_NAME_OVERPASS_BOLD }}>
                                    {title}
                                </div>
                            </div>
                        </button>
                    }
                </div>
                <div>
                    {Boolean(rightTitle) &&
                        <div style={{ flex: 1.5, marginRight: 8 }}>
                            <div style={{...customTextStyleHelper.TITLE_TEXT_H4_STYLE, textTransform: 'lowercase' }}>
                                {rightTitle}
                            </div>
                        </div>
                    }

                    {Boolean(errorMessage) &&
                        <div style={{...customTextStyleHelper.CONTENT_PADDING_STYLE, height: 50 }}>
                            <div style={{ flexDirection: 'row', flex: 5, paddingTop: 2 }}>
                                <Icon
                                    style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_REGULAR }}
                                    size={16}
                                    color={theme.MANDATORY_LABEL_TEXT_COLOR}
                                    icon= 'exclamation-circle'
                                />
                                <div style={{...customTextStyleHelper.TEXT_CAPTION_STYLE, marginLeft: 2, flex: 4.5, color: theme.MANDATORY_LABEL_TEXT_COLOR }}>
                                    {this.helper.upperCaseFirstChar(errorMessage)}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(CustomHeaderLeftRightText);

