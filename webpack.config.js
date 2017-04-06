var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './windows/app/index.js',
        loadkeys: './windows/loadkeys/index.js'
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].bundle.js',
        publicPath: 'http://localhost:8080'
    },
    module: {
        rules: [
            { 
                test: /\.(js|jsx)?$/,                 
                loader: 'babel-loader', 
                exclude: /node_modules/,
                query: { 
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread'] 
                }  
            },
            { 
                test: /\.(css|scss)$/, 
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader?sourceMap'     
                ]
            },
            {
                test: /\.svg$/,
                loader: 'url-loader'
            }                        
        ]
    },
    target: "electron-main" 
};