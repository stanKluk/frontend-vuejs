module.exports = {
    // Change build paths to make them Maven compatible
    // see https://cli.vuejs.org/config/
    publicPath: process.env.NODE_ENV === 'production' ? '/doc-repo-bo/' : '/',
    outputDir: 'target/dist',
    assetsDir: 'static',

    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                ws: true,
                changeOrigin: true
            },
            '/auth': {
                target: 'http://localhost:8081',
                ws: true,
                changeOrigin: true
            },
            '/logout': {
                target: 'http://localhost:8081',
                ws: true,
                changeOrigin: true
            }
        }
    },

    configureWebpack: {
        devtool: 'source-map'//used to work with vs code debugger for chrome extension
    },

    chainWebpack: config => {
        config.module
          .rule('vue')
          .use('vue-loader')
          .loader('vue-loader')
          .tap(options => {
            options.compilerOptions.preserveWhitespace = true /* added option because boostrap & html components must preserve spaces*/
            return options
          })
      },

    pluginOptions: {
      i18n: {
        locale: 'fr',
        fallbackLocale: 'fr',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
};
