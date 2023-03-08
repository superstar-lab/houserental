import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon} from 'rsuite';
import{ Form , Col, Row } from 'react-bootstrap';  

class CustomTextInputComponent extends React.Component {

    render() {
        const { caption, maxLength, placeholder, value,
            isDisabled, isRequired, onChangeText, errorMessage } = this.props;
        return (
            <Form.Group as={Row}>
                <Form.Label column sm="5">
                {caption}  {Boolean(isRequired) && <span style={{color: 'red'}}>*</span>}
                </Form.Label>
                    <Col sm="7">
                        <Form.Control  size="sm"
                            disabled={isDisabled}
                            maxLength={Boolean(maxLength) ? maxLength : 255}
                            value={value}
                            placeholder={Boolean(placeholder) ? placeholder : Helper.EMPTY}
                            onChange={e => Boolean(onChangeText) && onChangeText(e.target.value)} 
                        >
                        </Form.Control>
                        {Boolean(errorMessage) &&
                            <div>
                                <Icon icon='exclamation-circle'/>
                                <div>
                                    {Helper.upperCaseFirstChar(errorMessage)}
                                </div>
                            </div>
                        }
                    </Col>
            </Form.Group>
        );
    }
}

export default withRouter(CustomTextInputComponent);

