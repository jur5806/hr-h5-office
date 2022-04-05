// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index_office.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static_office',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `tru.e` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8199,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://192.168.0.190:8080/',
       target: 'http://test-media-api.test176.cn',
        // target: 'http://192.168.1.150:3080',
        // target: 'http://192.168.0.28:8080/',
        // target: 'https://ztlc-api.zhihuipk.com/',
        // target: 'http://192.168.0.102:22041/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/incubationApi': {
        // target: 'http://192.168.0.121:8080/park_app/',
       // target: 'http://192.168.129.8080/park_app/',
        target: 'http://test-media-api.test176.cn',
        // target: 'http://192.168.0.102:22041/',
        changeOrigin: true,
        pathRewrite: {
          '^/apps': '/apps'
        }
      },
      '/mhapi': {
        target: 'http://192.168.1.80:2080',
        // target: 'http://192.168.129.8080/park_app/',
        // target: 'http://test-property.test176.cn',
        // target: 'http://192.168.0.102:22041/',
        changeOrigin: true,
        pathRewrite: {
          '^/mhapi': '/mhapi'
        }
      },
      '/mortar': {
        // target: 'http://192.168.0.182:8080',
        // target: 'http://test-property.test176.cn',
        //target: 'http://192.168.0.153:8080',
        target: 'http://192.168.0.102:22041/',
        changeOrigin: true,
        pathRewrite: {
          '^/mortar': '/mortar'
        }
      },
      '/channel': {
        // target: 'http://192.168.0.182:8080',
        // target: 'http://test-trgj.test176.cn',
        //target: 'http://192.168.0.153:8080',
        target: 'http://192.168.0.102:22041/',
        changeOrigin: true,
        pathRewrite: {
          '^/channel': '/channel'
        }
      },
      "/march": {
        // target: "http://localhost:8822",//本地
        target: "http://localhost:8810",//本地
        pathRewrite: {
          "^/march": "/march"
        }
      }
    },


    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
