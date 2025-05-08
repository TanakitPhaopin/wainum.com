import React from 'react'
import Select from 'react-select'

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ]

export default function MySelectionBox ({options, name, isMulti, dafaultValue, className, placeholder, value, onChange, closeMenuOnSelect, class_select}) {
    return (
        <div className={className}>
            <Select 
                options={options} 
                name={name} 
                isMulti={isMulti} 
                defaultValue={dafaultValue} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                closeMenuOnSelect={closeMenuOnSelect} 
                className={class_select}
            />
        </div>
    )
}