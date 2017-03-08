var path = require('path');

module.exports = {
    context: path.resolve('js'),
    entry: ['./app','./index'],
    output: {
        path: path.resolve('build/js/'),
        publicPath: '/public/assets/js/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: 'public'
    },
    module: {
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "jshint-loader",
                enforce: 'pre'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader?sourceMap!sass-loader?sourceMap!' + path.resolve('./assets/css/loader')
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                exclude: /node_modules/,
                loaders: 'url-loader?name=[path][name].[ext]?limit:10000'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.es6', 'html', 'scss']
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    }
}