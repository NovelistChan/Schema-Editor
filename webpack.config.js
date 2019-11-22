module.exports = {
  mode: "production",
  entry: "./src/components/editor",
  output: {
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              "@babel/preset-react",
              "@babel/preset-env"
            ],
            "plugins": [
              "@babel/plugin-proposal-class-properties",
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  },
  externals: [
    { react: { commonjs: "react", commonjs2: "react", amd: 'react', root: ['React'] } },
    { "react-redux": { commonjs: "react-redux", commonjs2: "react-redux", amd: "react-redux", umd: 'react-redux' } },
    { underscore: { commonjs: "underscore", commonjs2: "underscore", amd: 'underscore', umd: 'underscore', root: ['_'] } },
    { brace: { commonjs: "brace", commonjs2: "brace", amd: 'brace', umd: 'brace', root: ['ace'] } },
    { moox: { commonjs: "moox", commonjs2: "moox", amd: 'moox', umd: 'moox' } },
    { "react-dom": { commonjs: "react-dom", commonjs2: "react-dom", amd: 'react-dom', umd: 'react-dom', root: ['ReactDom'] } },
    { redux: { commonjs: "redux", commonjs2: "redux", amd: 'redux', umd: 'redux' } },
    { "prop-types": { commonjs: "prop-types", commonjs2: "prop-types", amd: 'prop-types', umd: 'prop-types' } },
    { antd: { commonjs: "antd", commonjs2: "antd", amd: 'antd', umd: 'antd' } }
  ]
};