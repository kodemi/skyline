const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV.toLowerCase()
    : 'development';
const OPTIMIZE = process.env.OPTIMIZE
    ? JSON.parse(process.env.OPTIMIZE)
    : NODE_ENV === 'production';
const MODE_DEV_SERVER =
    process.argv[1].indexOf('webpack-dev-server') > -1 ? true : false;
const FAIL_ON_ERROR = process.env.FAIL_ON_ERROR
    ? JSON.parse(process.env.FAIL_ON_ERROR)
    : !MODE_DEV_SERVER;

const plugins = [];
plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(NODE_ENV)
        }
    })
);
plugins.push(
    new HtmlWebpackPlugin({
        template: 'index.tpl.html',
        filename: './index.html',
        alwaysWriteToDisk: true
    })
);
plugins.push(new HtmlWebpackHarddiskPlugin());
plugins.push(new FaviconsWebpackPlugin('./src/images/logo.png'));
// plugins.push(new ExtractTextPlugin({filename: 'bundle.css', allChunks: true }));
if (!FAIL_ON_ERROR) {
    plugins.push(new webpack.NoErrorsPlugin());
}
if (OPTIMIZE) {
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    );
}

const config = {
    target: 'web',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loaders: ['babel']
            },
            {
                test: /\.json?$/,
                exclude: /node_modules/,
                loader: 'json'
            },
            {
                test: /\.woff$/,
                loader:
                    'url?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.woff2$/,
                loader:
                    'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.[ot]tf$/,
                loader:
                    'url?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.eot$/,
                loader:
                    'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]'
            },
            { test: /\.(svg|png|jpg)$/, loader: 'url?limit=100000' }
        ]
    },
    postcss: [autoprefixer],
    sassLoader: {
        data: '@import "theme/_config.scss";',
        includePaths: [path.resolve(__dirname, './src')]
    },
    resolve: {
        root: path.resolve(__dirname, './src'),
        extensions: ['', '.js', '.json'],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },
    plugins: plugins
};

if (MODE_DEV_SERVER) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NamedModulesPlugin());

    config.devtool = 'eval-source-map';
    config.entry = [
        'babel-polyfill',
        'whatwg-fetch',
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ];
    config.module.loaders.push({
        test: /(\.scss|.css)$/,
        loaders:
            'style?singleton!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'
    });
    config.module.loaders.push({
        test: /(\.less)$/,
        loader: 'style?singleton!css!less'
    });
} else {
    config.devtool = 'cheap-module-source-map';
    config.entry = ['babel-polyfill', 'whatwg-fetch', './src/index.js'];
    config.plugins.push(
        new CleanWebpackPlugin(['public'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    );
    config.plugins.push(
        new ExtractTextPlugin({ filename: 'bundle.css', allChunks: true })
    );
    config.module.loaders.push({
        test: /(\.scss|.css)$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style',
            loader:
                'css?minimize&sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'
        })
    });
    config.module.loaders.push({
        test: /(\.less)$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style',
            loader: 'css!less'
        })
    });
}

module.exports = config;
