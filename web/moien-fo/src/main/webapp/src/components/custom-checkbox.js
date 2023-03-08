import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'rsuite'; 

class CustomCheckbox extends Component {
    render() {
        const {onChanged} = this.props;
       return(
           <div>
            {
                this.props.checked 
                    ? <Icon icon='check-circle' size='2x'
                        style={{color: '#40DCB6'}}
                        disabled={this.props.disabled}
                        onClick={e => {
                            if (!this.props.disabled && onChanged) {
                               onChanged(true)
                            }
                        }}
                    />
                    : <Icon icon='circle' size='2x'
                        style={{color: 'rgba(202,202,216,0.3)'}}
                        disabled={this.props.disabled}
                        onClick={e => {
                            if (!this.props.disabled && onChanged) {
                               onChanged(false)
                            }
                        }}/>
            }
           </div>
           
       )
    }
}

export default CustomCheckbox;

CustomCheckbox.propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChanged: PropTypes.func
}

CustomCheckbox.defaultProps = {
    checked: false,
    disabled: false 
}