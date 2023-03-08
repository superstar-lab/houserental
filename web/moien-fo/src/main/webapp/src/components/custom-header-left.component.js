import React from 'react';
import { Icon } from "rsuite";
import { withRouter } from 'react-router-dom';
import theme from '../theme/theme';
import Helper from '../helper/helper';

class CustomHeaderLeft extends React.Component {

    render() {
        const { title, isHideBack, onBackPress, rightComponent, errorMessage } = this.props;
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.OFF_WHITE, borderBottomWidth: 0, paddingHorizontal: theme.SCREEN_PADDING}} >
                    <div>
                        {!isHideBack &&
                            <button className= 'button-back' style={{ width: 30, justifyContent: 'center', alignItems: 'center' }}
                                onClick={(e) => onBackPress ? onBackPress(e) : this.props.history.push('/')}>
                                <Icon style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID, color: theme.FONT_COLOR_TEXT_TITLE }}
                                    size={18}
                                    size='2x' color={theme.BORDER_COLOR}
                                    icon= 'angle-left'
                                />
                            </button>
                        }
                    </div>
                    <div />
                    {
                        rightComponent ? (
                            <div>
                                {rightComponent}
                            </div>
                        ) : <div />
                    }
                </div>

                {title != null && title != '' &&
                    <div>
                        {title}
                    </div>
                }

                {errorMessage != null && errorMessage != '' ?
                    <div>
                        {Helper.upperCaseFirstChar(errorMessage)}
                    </div> 
                    : 
                    null
                }
            </div>
        );
    }
}


export default withRouter(CustomHeaderLeft);

