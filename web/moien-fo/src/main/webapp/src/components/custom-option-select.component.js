import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TagGroup, Tag} from 'rsuite';

class CustomOptionSelectComponent extends Component {

    handleItemSelected(items, item) {
        items.find(it => it.id == item.id).value = !item.value;
        this.props.onSelect(items);
    }

    render() {
        const {items, onSelect} = this.props;

        return (
            <TagGroup className='custom-option-component'>
                {
                    items.map((item, index) =>
                    item.value === true
                        ? <Tag style={{cursor: 'pointer', border: '1px solid #ced4da', backgroundColor: '#40DCB6', fontSize: '.8rem'}} onClick={e => onSelect && this.handleItemSelected(items, item)} color="blue" key={index}>{item.desc}</Tag>
                        : <Tag style={{cursor: 'pointer', border: '1px solid #ced4da', fontSize: '.8rem'}} onClick={e => onSelect && this.handleItemSelected(items, item)} key={index}>{item.desc}</Tag>
                    )
                }
            </TagGroup>
        );
    }
}

CustomOptionSelectComponent.propTypes = {
    items: PropTypes.array.isRequired,
    onSelect: PropTypes.func
};

export default CustomOptionSelectComponent;