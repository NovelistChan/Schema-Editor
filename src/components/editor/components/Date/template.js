import React, { PureComponent } from 'react'
import { Cascader, Row, Col, Input, InputNumber, Button, Select, Checkbox, Icon, Tooltip, Switch } from 'antd'
import PropTypes from 'prop-types'
// import { connect } from 'dva'
import _ from 'underscore'

const { TextArea } = Input;
const { Option } = Select;

class CustomizedSchemaDate extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            checked: !_.isUndefined(props.data.enum),
        };
        this.format = context.Model.__jsonSchemaFormat;
    }

    componentWillReceiveProps(nextprops) {
        if (this.props.data.enum !== nextprops.data.enum) {
            this.setState({
                checked: !_.isUndefined(nextprops.data.enum),
            });
        }
    }

    changeOtherValue = (value, name, data) => {
        data[name] = value;
        this.context.changeCustomValue(data);
    };

    changeEnumOtherValue = (value, data) => {
        const arr = value.split('\n');
        if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
            delete data.enum;
            this.context.changeCustomValue(data);
        } else {
            data.enum = arr;
            this.context.changeCustomValue(data);
        }
    };

    changeEnumDescOtherValue = (value, data) => {
        data.enumDesc = value;
        this.context.changeCustomValue(data);
    };

    onChangeCheckBox = (checked, data) => {
        this.setState({
            checked,
        });
        if (!checked) {
            delete data.enum;
            this.context.changeCustomValue(data);
        }
    };

    render() {
        const { data } = this.props;
        return (
    
            <div>
                {/* <div>this</div> */}
                <div className="default-setting">base_setting</div>
                <Row className="other-row" type="flex" align="middle">
                    <Col span={4} className="other-label">
                        default：
            </Col>
                    <Col span={20}>
                        <Input
                            value={data.default}
                            placeholder='default'
                            onChange={e => this.changeOtherValue(e.target.value, 'default', data)}
                        />
                    </Col>
                </Row>
                <Row className="other-row" type="flex" align="middle">
                    <Col span={12}>
                        <Row type="flex" align="middle">
                            <Col span={8} className="other-label">
                                minLength：
                </Col>
                            <Col span={16}>
                                <InputNumber
                                    value={data.minLength}
                                    placeholder="min.length"
                                    onChange={e => this.changeOtherValue(e, 'minLength', data)}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row type="flex" align="middle">
                            <Col span={8} className="other-label">
                                maxLength：
                </Col>
                            <Col span={16}>
                                <InputNumber
                                    value={data.maxLength}
                                    placeholder="max.length"
                                    onChange={e => this.changeOtherValue(e, 'maxLength', data)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="other-row" type="flex" align="middle">
                    <Col span={4} className="other-label">
                        <span>
                            Pattern&nbsp;
                <Tooltip title={'pattern'}>
                                <Icon type="question-circle-o" style={{ width: '10px' }} />
                            </Tooltip>
                            &nbsp; :
              </span>
                    </Col>
                    <Col span={20}>
                        <Input
                            value={data.pattern}
                            placeholder="Pattern"
                            onChange={e => this.changeOtherValue(e.target.value, 'pattern', data)}
                        />
                    </Col>
                </Row>
                <Row className="other-row" type="flex" align="middle">
                    <Col span={4} className="other-label">
                        <span>
                            enum
                <Checkbox
                                checked={this.state.checked}
                                onChange={e => this.onChangeCheckBox(e.target.checked, data)}
                            />{' '}
                            :
              </span>
                    </Col>
                    <Col span={20}>
                        <TextArea
                            value={data.enum && data.enum.length && data.enum.join('\n')}
                            disabled={!this.state.checked}
                            placeholder='enum_msg'
                            autosize={{ minRows: 2, maxRows: 6 }}
                            onChange={e => {
                                this.changeEnumOtherValue(e.target.value, data);
                            }}
                        />
                    </Col>
                </Row>
                {this.state.checked && (
                    <Row className="other-row" type="flex" align="middle">
                        <Col span={4} className="other-label">
                            {/* <span>{LocalProvider('enum_desc')}</span> */}
                        </Col>
                        <Col span={20}>
                            <TextArea
                                value={data.enumDesc}
                                disabled={!this.state.checked}
                                placeholder='enum_desc_msg'
                                autosize={{ minRows: 2, maxRows: 6 }}
                                onChange={e => {
                                    this.changeEnumDescOtherValue(e.target.value, data);
                                }}
                            />
                        </Col>
                    </Row>
                )}
                <Row className="other-row" type="flex" align="middle">
                    <Col span={4} className="other-label">
                        <span>format :</span>
                    </Col>
                    <Col span={20}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            value={data.format}
                            dropdownClassName="json-schema-react-editor-adv-modal-select"
                            placeholder="Select a format"
                            optionFilterProp="children"
                            optionLabelProp="value"
                            onChange={e => this.changeOtherValue(e, 'format', data)}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {this.format.map(item => (
                                <Option value={item.name} key={item.name}>
                                    {item.name} <span className="format-items-title">{item.title}</span>
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>
        );
    }
}

CustomizedSchemaDate.contextTypes = {
    changeCustomValue: PropTypes.func,
    Model: PropTypes.object,
}

export default CustomizedSchemaDate
