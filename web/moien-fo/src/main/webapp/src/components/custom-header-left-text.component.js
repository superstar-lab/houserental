import React from 'react';

import { withRouter } from 'react-router-dom';
import theme from '../theme/theme';
import Helper from '../helper/helper';
import customTextStyleHelper from '../helper/custom-text-style.helper';
import { Icon } from 'rsuite';
import './style-components.css';

/** */
class CustomHeaderLeftText extends React.Component {

    render() {
        const { title, isHideBack, onBackPress } = this.props;
        return (
            <div>
                { !isHideBack &&
                    <button className= 'button-back'
                        onClick={(e) => onBackPress ? onBackPress(e) : this.props.history.push('/asset-home')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ marginRight: 10 }}>
                                <Icon 
                                    style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID, color: theme.FONT_COLOR_TEXT_TITLE }}
                                    size={18}
                                    size='2x' color={theme.BORDER_COLOR} 
                                    icon= 'angle-left'
                                />
                            </div>
                            <div style={{ fontSize: 17, fontFamily: theme.FONT_NAME_OVERPASS_BOLD }}>
                                {title}
                            </div>
                        </div>
                    </button>
                }
            </div>
        );
    }
}


export default withRouter(CustomHeaderLeftText);

