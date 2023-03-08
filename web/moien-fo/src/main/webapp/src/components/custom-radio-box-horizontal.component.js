import React from 'react';
import { withRouter } from 'react-router-dom';
import {Icon} from 'rsuite';
import Helper from '../helper/helper';
import theme from '../theme/theme';
/** */
class CustomRadioBoxHorizontalComponent extends React.Component {

    render() {
        const { label, value, onChange } = this.props;
        return (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
                <div style={{color: theme.FONT_COLOR_TEXT_BODY}}>
                    {label}
                </div>
                <div> 
                    <button style={{padding: 0, width: 23}} onClick={(e) => {onChange && onChange(e)}}>
                        <div style={{backgroundColor: Boolean(value) ? theme.FONT_COLOR_LINK : 'rgba(202,202,216,0.3)',
                            borderColor:  Boolean(value) ? theme.FONT_COLOR_LINK : 'rgba(202,202,216,0.5)'}}>
                            <Icon
                                style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID, fontSize: 12, color: theme.WHITE}}
                                icon='check'
                            />
                        </div>
                    </button>
                    <button style={{marginLeft: 10, padding: 0, width: 23}} onClick={(e) => {onChange && onChange(e)}}>
                        <div style={{ backgroundColor: !Boolean(Helper.isObjectNotNull(value)) ? 'rgba(202,202,216,0.3)': Boolean(value) ? 'rgba(202,202,216,0.3)': theme.FONT_COLOR_TEXT_BODY ,
                            borderColor: !Boolean(Helper.isObjectNotNull(value)) ? 'rgba(202,202,216,0.5)': Boolean(value) ? 'rgba(202,202,216,0.5)': theme.FONT_COLOR_TEXT_BODY}}>
                            <Icon
                                style={{ fontFamily: theme.FONT_NAME_AWESOME5PRO_SOLID, fontSize: 12, color: theme.WHITE}}
                                icon='times-circle'
                            />
                        </div>
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(CustomRadioBoxHorizontalComponent);
