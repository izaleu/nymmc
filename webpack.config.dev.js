//eslint-disable-next-line no-unused-vars
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './backend/public');
console.log(BUILD_DIR)
var APP_DIR = path.resolve(__dirname, 'src/');
var IMAGES_DIR = path.resolve(__dirname, 'src/assets/images');
var THIRDPARTY_DIR = path.resolve(__dirname, 'node_modules/');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ExtractTextPluginConfig = new ExtractTextPlugin({
    // define where to save the file
    filename: 'build.css',
});

//Webpack merge
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

var config = {
    entry: [
        'react-hot-loader/patch',
        APP_DIR + '/index.js',
        APP_DIR + '/core/styles/index.css',
    ],
    output: {
        path: BUILD_DIR,
    },
    plugins: [
        ExtractTextPluginConfig,
        new CopyWebpackPlugin([{
            from: path.join(APP_DIR, '/index.html'),
            to: path.join(BUILD_DIR, '/index.html')
        }]),
        new CopyWebpackPlugin([{
            from: IMAGES_DIR,
            to: BUILD_DIR
        }]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)})
    ],
    devServer: {
        contentBase: BUILD_DIR,
        compress: true,
        port: 5678,
        hot: true,
        proxy: { '**': 'http://localhost:1234/' },
        publicPath: '/',
        historyApiFallback: {
            index: '/index.html'
        }
    }
};

module.exports = merge(common, config);
