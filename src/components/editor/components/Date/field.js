// import { StringField } from 'react-jsonschema-form-lab'
import React from 'react'
import { Input } from 'antd';

const DateField = 
    _=> (
        <div>
            <p>date</p>
            <Input placeholder = "Input date in format: xxxx/xx/xx"/>
        </div>
    )

export default DateField