import React from 'react'
import { Provider } from 'react-redux'
import App from './App.js'
import utils from './utils'
import moox from 'moox'
import schema from './models/schema'
import PropTypes from 'prop-types'
import 'antd/dist/antd.css'

function editor(config = {}) {
  if (config.lang) utils.lang = config.lang;

  if (config.defaultSchema) {
    var type;
    for (type in config.defaultSchema) {
      if (utils.SCHEMA_TYPE.indexOf(type) === -1) {
        utils.SCHEMA_TYPE.push(type)
      }
    }
    utils.defaultSchema = {
      ...utils.defaultSchema,
      ...config.defaultSchema,
    };
  }

  const Model = moox({
    schema
  })
  if (config.format) {
    Model.__jsonSchemaFormat = config.format
  } else {
    Model.__jsonSchemaFormat = utils.format
  }

  if (config.mock) {
    Model.__jsonSchemaMock = config.mock
  }


  const store = Model.getStore();

  const Component = (props) => {
    return (
      <Provider store={store} className="wrapper">
        <App Model={Model} {...props} />
      </Provider>
    )
  }

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool,
    metaSchema: PropTypes.array, // 自定义meta schema
  }

  Component.defaultProps = {
    metaSchema: utils.SCHEMA_TYPE,
    showEditor: false,
  }

  return Component;

}

export default function (options) {

  let config = {
    defaultSchema: {

    }
  }

  let templates = {}
  for (const property in options.extensions) {
    config.defaultSchema[property] = options.extensions[property].schema
    templates[property] = options.extensions[property].template
  }

  const Editor = editor(config)

  let advancedTemplate = (data, context) => {
    const Template = templates[data.type] || null
    return <Template data={data} context={context} />
  }

  return <Editor {...options} advancedTemplate={advancedTemplate} />
}
