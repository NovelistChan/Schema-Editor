import React, { PureComponent } from 'react';
import {
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Checkbox,
  Icon,
  Tooltip,
  Switch,
} from 'antd';
import './schemaJson.css';
import _ from 'underscore';
import PropTypes from 'prop-types';
import AceEditor from '../AceEditor/AceEditor.js';
import LocalProvider from '../LocalProvider/index.js';

const { TextArea } = Input;
const { Option } = Select;

const changeOtherValue = (value, name, data, change) => {
  data[name] = value;
  change(data);
};

class SchemaString extends PureComponent {
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
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('default')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.default}
              placeholder={LocalProvider('default')}
              onChange={e => this.changeOtherValue(e.target.value, 'default', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('minLength')}：
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
                {LocalProvider('maxLength')}：
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
              <Tooltip title={LocalProvider('pattern')}>
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
              {LocalProvider('enum')}
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
              placeholder={LocalProvider('enum_msg')}
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
              <span>{LocalProvider('enum_desc')}</span>
            </Col>
            <Col span={20}>
              <TextArea
                value={data.enumDesc}
                disabled={!this.state.checked}
                placeholder={LocalProvider('enum_desc_msg')}
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

SchemaString.contextTypes = {
  changeCustomValue: PropTypes.func,
  Model: PropTypes.object,
};

class SchemaNumber extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: !_.isUndefined(props.data.enum),
      enum: _.isUndefined(props.data.enum) ? '' : props.data.enum.join('\n'),
    };
  }

  componentWillReceiveProps(nextprops) {
    const enumStr = _.isUndefined(this.props.data.enum) ? '' : this.props.data.enum.join('\n');
    const nextEnumStr = _.isUndefined(nextprops.data.enum) ? '' : nextprops.data.enum.join('\n');
    if (enumStr !== nextEnumStr) {
      this.setState({ enum: nextEnumStr });
    }
  }

  onChangeCheckBox = (checked, data) => {
    this.setState({
      checked,
    });

    if (!checked) {
      delete data.enum;
      this.setState({ enum: '' });
      this.context.changeCustomValue(data);
    }
  };

  changeEnumOtherValue = (value, data) => {
    this.setState({ enum: value });
    const arr = value.split('\n');
    const enumLen = this.state.enum.split('\n').length;
    // 判断是否是删除操作
    if (enumLen > arr.length) {
      data.enum = arr.map(item => +item);
      this.context.changeCustomValue(data);
    }
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete data.enum;
      this.context.changeCustomValue(data);
    }
  };

  onEnterEnumOtherValue = (value, data) => {
    const arr = value.split('\n').map(item => +item);
    data.enum = arr;
    this.context.changeCustomValue(data);
  };

  changeEnumDescOtherValue = (value, data) => {
    data.enumDesc = value;
    this.context.changeCustomValue(data);
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('default')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.default}
              placeholder={LocalProvider('default')}
              onChange={e =>
                changeOtherValue(e.target.value, 'default', data, this.context.changeCustomValue)
              }
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={13} className="other-label">
                <span>
                  exclusiveMinimum&nbsp;
                  <Tooltip title={LocalProvider('exclusiveMinimum')}>
                    <Icon type="question-circle-o" style={{ width: '10px' }} />
                  </Tooltip>
                  &nbsp; :
                </span>
              </Col>
              <Col span={11}>
                <Switch
                  checked={data.exclusiveMinimum}
                  placeholder="exclusiveMinimum"
                  onChange={e =>
                    changeOtherValue(e, 'exclusiveMinimum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={13} className="other-label">
                <span>
                  exclusiveMaximum&nbsp;
                  <Tooltip title={LocalProvider('exclusiveMaximum')}>
                    <Icon type="question-circle-o" style={{ width: '10px' }} />
                  </Tooltip>
                  &nbsp; :
                </span>
              </Col>
              <Col span={11}>
                <Switch
                  checked={data.exclusiveMaximum}
                  placeholder="exclusiveMaximum"
                  onChange={e =>
                    changeOtherValue(e, 'exclusiveMaximum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('minimum')}：
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.minimum}
                  placeholder={LocalProvider('minimum')}
                  onChange={e =>
                    changeOtherValue(e, 'minimum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('maximum')}：
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.maximum}
                  placeholder={LocalProvider('maximum')}
                  onChange={e =>
                    changeOtherValue(e, 'maximum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            <span>
              {LocalProvider('enum')}
              <Checkbox
                checked={this.state.checked}
                onChange={e => this.onChangeCheckBox(e.target.checked, data)}
              />{' '}
              :
            </span>
          </Col>
          <Col span={20}>
            <TextArea
              // value={data.enum && data.enum.length && data.enum.join('\n')}
              value={this.state.enum}
              disabled={!this.state.checked}
              placeholder={LocalProvider('enum_msg')}
              autosize={{ minRows: 2, maxRows: 6 }}
              onChange={e => {
                this.changeEnumOtherValue(e.target.value, data);
              }}
              onPressEnter={e => this.onEnterEnumOtherValue(e.target.value, data)}
            />
          </Col>
        </Row>
        {this.state.checked && (
          <Row className="other-row" type="flex" align="middle">
            <Col span={4} className="other-label">
              <span>{LocalProvider('enum_desc')} ：</span>
            </Col>
            <Col span={20}>
              <TextArea
                value={data.enumDesc}
                disabled={!this.state.checked}
                placeholder={LocalProvider('enum_desc_msg')}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => {
                  this.changeEnumDescOtherValue(e.target.value, data);
                }}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

SchemaNumber.contextTypes = {
  changeCustomValue: PropTypes.func,
};

const SchemaBoolean = (props, context) => {
  const { data } = props;
  const value = _.isUndefined(data.default) ? '' : data.default ? 'true' : 'false';
  return (
    <div>
      <div className="default-setting">{LocalProvider('base_setting')}</div>
      <Row className="other-row" type="flex" align="middle">
        <Col span={4} className="other-label">
          {LocalProvider('default')}：
        </Col>
        <Col span={20}>
          <Select
            value={value}
            onChange={e =>
              changeOtherValue(
                e === 'true',
                'default',
                data,
                context.changeCustomValue,
              )
            }
            style={{ width: 200 }}
          >
            <Option value="true">true</Option>
            <Option value="false">false</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

SchemaBoolean.contextTypes = {
  changeCustomValue: PropTypes.func,
};

const SchemaArray = (props, context) => {
  const { data } = props;
  return (
    <div>
      <div className="default-setting">{LocalProvider('base_setting')}</div>
      <Row className="other-row" type="flex" align="middle">
        <Col span={6} className="other-label">
          <span>
            uniqueItems&nbsp;
            <Tooltip title={LocalProvider('unique_items')}>
              <Icon type="question-circle-o" style={{ width: '10px' }} />
            </Tooltip>
            &nbsp; :
          </span>
        </Col>
        <Col span={18}>
          <Switch
            checked={data.uniqueItems}
            placeholder="uniqueItems"
            onChange={e => changeOtherValue(e, 'uniqueItems', data, this.context.changeCustomValue)}
          />
        </Col>
      </Row>
      <Row className="other-row" type="flex" align="middle">
        <Col span={12}>
          <Row type="flex" align="middle">
            <Col span={12} className="other-label">
              {LocalProvider('min_items')}：
            </Col>
            <Col span={12}>
              <InputNumber
                value={data.minItems}
                placeholder="minItems"
                onChange={e => changeOtherValue(e, 'minItems', data, this.context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row type="flex" align="middle">
            <Col span={12} className="other-label">
              {LocalProvider('max_items')}：
            </Col>
            <Col span={12}>
              <InputNumber
                value={data.maxItems}
                placeholder="maxItems"
                onChange={e => changeOtherValue(e, 'maxItems', data, this.context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

SchemaArray.contextTypes = {
  changeCustomValue: PropTypes.func,
};

class CustomizedSchemaObject extends PureComponent {
  constructor(props) {
    super(props)
  }

  changeOtherValue = (value, name, data) => {
    data[name] = value;
    this.context.changeCustomValue(data);
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('section')}：
            </Col>
          <Col span={20}>
            <Input
              value={data.section}
              placeholder={LocalProvider('section')}
              onChange={e => this.changeOtherValue(e.target.value, 'section', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('group')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.group}
              placeholder={LocalProvider('group')}
              onChange={e => this.changeOtherValue(e.target.value, 'group', data)}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

CustomizedSchemaObject.contextTypes = {
  changeCustomValue: PropTypes.func,
};

class CustomizedSchemaString extends PureComponent {
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
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('default')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.default}
              placeholder={LocalProvider('default')}
              onChange={e => this.changeOtherValue(e.target.value, 'default', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('minLength')}：
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
                {LocalProvider('maxLength')}：
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
              <Tooltip title={LocalProvider('pattern')}>
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
              {LocalProvider('enum')}
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
              placeholder={LocalProvider('enum_msg')}
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
              <span>{LocalProvider('enum_desc')}</span>
            </Col>
            <Col span={20}>
              <TextArea
                value={data.enumDesc}
                disabled={!this.state.checked}
                placeholder={LocalProvider('enum_desc_msg')}
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
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('section')}：
            </Col>
          <Col span={20}>
            <Input
              value={data.section}
              placeholder={LocalProvider('section')}
              onChange={e => this.changeOtherValue(e.target.value, 'section', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('group')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.group}
              placeholder={LocalProvider('group')}
              onChange={e => this.changeOtherValue(e.target.value, 'group', data)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
CustomizedSchemaString.contextTypes = {
  changeCustomValue: PropTypes.func,
  Model: PropTypes.object,
};

class CustomizedSchemaNumber extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: !_.isUndefined(props.data.enum),
      enum: _.isUndefined(props.data.enum) ? '' : props.data.enum.join('\n'),
    };
  }

  componentWillReceiveProps(nextprops) {
    const enumStr = _.isUndefined(this.props.data.enum) ? '' : this.props.data.enum.join('\n');
    const nextEnumStr = _.isUndefined(nextprops.data.enum) ? '' : nextprops.data.enum.join('\n');
    if (enumStr !== nextEnumStr) {
      this.setState({ enum: nextEnumStr });
    }
  }

  onChangeCheckBox = (checked, data) => {
    this.setState({
      checked,
    });

    if (!checked) {
      delete data.enum;
      this.setState({ enum: '' });
      this.context.changeCustomValue(data);
    }
  };

  changeEnumOtherValue = (value, data) => {
    this.setState({ enum: value });
    const arr = value.split('\n');
    const enumLen = this.state.enum.split('\n').length;
    // 判断是否是删除操作
    if (enumLen > arr.length) {
      data.enum = arr.map(item => +item);
      this.context.changeCustomValue(data);
    }
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete data.enum;
      this.context.changeCustomValue(data);
    }
  };

  onEnterEnumOtherValue = (value, data) => {
    const arr = value.split('\n').map(item => +item);
    data.enum = arr;
    this.context.changeCustomValue(data);
  };

  changeEnumDescOtherValue = (value, data) => {
    data.enumDesc = value;
    this.context.changeCustomValue(data);
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('default')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.default}
              placeholder={LocalProvider('default')}
              onChange={e =>
                changeOtherValue(e.target.value, 'default', data, this.context.changeCustomValue)
              }
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={13} className="other-label">
                <span>
                  exclusiveMinimum&nbsp;
                  <Tooltip title={LocalProvider('exclusiveMinimum')}>
                    <Icon type="question-circle-o" style={{ width: '10px' }} />
                  </Tooltip>
                  &nbsp; :
                </span>
              </Col>
              <Col span={11}>
                <Switch
                  checked={data.exclusiveMinimum}
                  placeholder="exclusiveMinimum"
                  onChange={e =>
                    changeOtherValue(e, 'exclusiveMinimum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={13} className="other-label">
                <span>
                  exclusiveMaximum&nbsp;
                  <Tooltip title={LocalProvider('exclusiveMaximum')}>
                    <Icon type="question-circle-o" style={{ width: '10px' }} />
                  </Tooltip>
                  &nbsp; :
                </span>
              </Col>
              <Col span={11}>
                <Switch
                  checked={data.exclusiveMaximum}
                  placeholder="exclusiveMaximum"
                  onChange={e =>
                    changeOtherValue(e, 'exclusiveMaximum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('minimum')}：
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.minimum}
                  placeholder={LocalProvider('minimum')}
                  onChange={e =>
                    changeOtherValue(e, 'minimum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('maximum')}：
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.maximum}
                  placeholder={LocalProvider('maximum')}
                  onChange={e =>
                    changeOtherValue(e, 'maximum', data, this.context.changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            <span>
              {LocalProvider('enum')}
              <Checkbox
                checked={this.state.checked}
                onChange={e => this.onChangeCheckBox(e.target.checked, data)}
              />{' '}
              :
            </span>
          </Col>
          <Col span={20}>
            <TextArea
              // value={data.enum && data.enum.length && data.enum.join('\n')}
              value={this.state.enum}
              disabled={!this.state.checked}
              placeholder={LocalProvider('enum_msg')}
              autosize={{ minRows: 2, maxRows: 6 }}
              onChange={e => {
                this.changeEnumOtherValue(e.target.value, data);
              }}
              onPressEnter={e => this.onEnterEnumOtherValue(e.target.value, data)}
            />
          </Col>
        </Row>
        {this.state.checked && (
          <Row className="other-row" type="flex" align="middle">
            <Col span={4} className="other-label">
              <span>{LocalProvider('enum_desc')} ：</span>
            </Col>
            <Col span={20}>
              <TextArea
                value={data.enumDesc}
                disabled={!this.state.checked}
                placeholder={LocalProvider('enum_desc_msg')}
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
            {LocalProvider('section')}：
            </Col>
          <Col span={20}>
            <Input
              value={data.section}
              placeholder={LocalProvider('section')}
              onChange={e => this.changeOtherValue(e.target.value, 'section', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('group')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.group}
              placeholder={LocalProvider('group')}
              onChange={e => this.changeOtherValue(e.target.value, 'group', data)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

CustomizedSchemaNumber.contextTypes = {
  changeCustomValue: PropTypes.func,
};

const CustomizedSchemaBoolean = (props, context) => {
  const { data } = props;
  const value = _.isUndefined(data.default) ? '' : data.default ? 'true' : 'false';
  return (
    <div>
      <div className="default-setting">{LocalProvider('base_setting')}</div>
      <Row className="other-row" type="flex" align="middle">
        <Col span={4} className="other-label">
          {LocalProvider('default')}：
        </Col>
        <Col span={20}>
          <Select
            value={value}
            onChange={e =>
              changeOtherValue(
                e === 'true',
                'default',
                data,
                context.changeCustomValue,
              )
            }
            style={{ width: 200 }}
          >
            <Option value="true">true</Option>
            <Option value="false">false</Option>
          </Select>
        </Col>
      </Row>
      <Row className="other-row" type="flex" align="middle">
        <Col span={4} className="other-label">
          {LocalProvider('section')}：
            </Col>
        <Col span={20}>
          <Input
            value={data.section}
            placeholder={LocalProvider('section')}
            onChange={e => changeOtherValue(e.target.value, 'section', data, context.changeCustomValue)}
          />
        </Col>
      </Row>
      <Row className="other-row" type="flex" align="middle">
        <Col span={4} className="other-label">
          {LocalProvider('group')}：
          </Col>
        <Col span={20}>
          <Input
            value={data.group}
            placeholder={LocalProvider('group')}
            onChange={e => changeOtherValue(e.target.value, 'group', data, context.changeCustomValue)}
          />
        </Col>
      </Row>
    </div>
  );
};

CustomizedSchemaBoolean.contextTypes = {
  changeCustomValue: PropTypes.func,
};

class CustomizedSchemaArray extends PureComponent {

  changeOtherValue = (value, name, data) => {
    data[name] = value;
    this.context.changeCustomValue(data);
  };

  render() {
    const { data, context } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={6} className="other-label">
            <span>
              uniqueItems&nbsp;
            <Tooltip title={LocalProvider('unique_items')}>
                <Icon type="question-circle-o" style={{ width: '10px' }} />
              </Tooltip>
              &nbsp; :
          </span>
          </Col>
          <Col span={18}>
            <Switch
              checked={data.uniqueItems}
              placeholder="uniqueItems"
              onChange={e => changeOtherValue(e, 'uniqueItems', data, this.context.changeCustomValue)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={12} className="other-label">
                {LocalProvider('min_items')}：
            </Col>
              <Col span={12}>
                <InputNumber
                  value={data.minItems}
                  placeholder="minItems"
                  onChange={e => changeOtherValue(e, 'minItems', data, this.context.changeCustomValue)}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={12} className="other-label">
                {LocalProvider('max_items')}：
            </Col>
              <Col span={12}>
                <InputNumber
                  value={data.maxItems}
                  placeholder="maxItems"
                  onChange={e => changeOtherValue(e, 'maxItems', data, this.context.changeCustomValue)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('section')}：
            </Col>
          <Col span={20}>
            <Input
              value={data.section}
              placeholder={LocalProvider('section')}
              onChange={e => this.changeOtherValue(e.target.value, 'section', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('group')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.group}
              placeholder={LocalProvider('group')}
              onChange={e => this.changeOtherValue(e.target.value, 'group', data)}
            />
          </Col>
        </Row>
      </div>
    )
  }
};

CustomizedSchemaArray.contextTypes = {
  changeCustomValue: PropTypes.func,
};

class CustomizedSchemaArrayTable extends PureComponent {
  changeOtherValue = (value, name, data) => {
    data[name] = value;
    this.context.changeCustomValue(data);
  };

  render() {
    const { data, context } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" type="flex" align="middle">
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={12} className="other-label">
                {LocalProvider('min_rows')}：
            </Col>
              <Col span={12}>
                <InputNumber
                  value={data.minRows}
                  placeholder="minRows"
                  onChange={e => changeOtherValue(e, 'minRows', data, this.context.changeCustomValue)}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row type="flex" align="middle">
              <Col span={12} className="other-label">
                {LocalProvider('max_rows')}：
            </Col>
              <Col span={12}>
                <InputNumber
                  value={data.maxRows}
                  placeholder="maxRows"
                  onChange={e => changeOtherValue(e, 'maxRows', data, this.context.changeCustomValue)}
                />
              </Col>
            </Row>
          </Col>
          
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('section')}：
            </Col>
          <Col span={20}>
            <Input
              value={data.section}
              placeholder={LocalProvider('section')}
              onChange={e => this.changeOtherValue(e.target.value, 'section', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('group')}：
          </Col>
          <Col span={20}>
            <Input
              value={data.group}
              placeholder={LocalProvider('group')}
              onChange={e => this.changeOtherValue(e.target.value, 'group', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" type="flex" align="middle">
        
              <Col span={4} className="other-label">
                {LocalProvider('editable')}：
            </Col>
              <Col span={20}>
                <Select
                  value={data.editable}
                  placeholder="TrueOrFalse"
                  style={{width: 120}}
                  onChange={e => changeOtherValue(e, 'editable', data, this.context.changeCustomValue)}
                >
                  <Option value="true">true</Option>
              <Option value="false">false</Option>
                  </Select>
              </Col>
        </Row>
      </div>
    )
  }
}

CustomizedSchemaArrayTable.contextTypes = {
  changeCustomValue: PropTypes.func,
}

export const mapping = data => ({
  string: <CustomizedSchemaString data={data} />,
  number: <CustomizedSchemaNumber data={data} />,
  boolean: <CustomizedSchemaBoolean data={data} />,
  integer: <CustomizedSchemaNumber data={data} />,
  array: <CustomizedSchemaArray data={data} />,
  object: <CustomizedSchemaObject data={data} />,
  arrayTable: <CustomizedSchemaArrayTable data={data} />
}[data.type]);

const handleInputEditor = (e, change) => {
  if (!e.text) return;
  change(e.jsonData);
};

const CustomItem = (props, context) => {
  const { data } = props;
  const optionForm = mapping(JSON.parse(data)) || props.advancedTemplate(JSON.parse(data), context)
  return (
    <div>
      <div>{optionForm}</div>
      <div className="default-setting">{LocalProvider('all_setting')}</div>
      <AceEditor
        data={data}
        mode="json"
        onChange={e => handleInputEditor(e, context.changeCustomValue)}
      />
    </div>
  );
};

CustomItem.contextTypes = {
  changeCustomValue: PropTypes.func,
};

export default CustomItem;
