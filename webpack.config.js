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
                loader: 'style-loader!css-loader?sourceMap!resolve-url-loader?sourceMap!sass-loader?sourceMap!' + path.resolve('./assets/css/loader')
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            },
            {
                test    : /\.(png|jpg|svg)$/,
                exclude: /node_modules/,
                include : path.join(__dirname, './assets/images'),
                loader  : 'resolve-url-loader?limit=30000&name=images/[path][name].[ext]'
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