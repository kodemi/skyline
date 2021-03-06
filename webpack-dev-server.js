var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    contentBase: './public',
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      chunks: false,
      assets: false
    }
}).listen(3000, '0.0.0.0', function (err, result) {
    if (err) {
      return console.log(err);
    }

    console.log('Listening at http://0.0.0.0:3000/');
});