let path = require('path');
let webpack = require('webpack');

module.exports = {
    context: path.resolve('js'),
    entry: './app',
    output: {
        path: path.resolve('build/js/'),
        publicPath: '/public/assets/js/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: 'public'
    },
    resolve: {
        extensions: ['*','.js', '.es6', 'html', 'scss'],
        alias: {
            'constants': path.resolve(__dirname, './data/constants')
        }
    },
    plugins: [
        // Any modules listed here will be available throughout
        // the application without separate require statements
        // (must also include them in resolve.alias above)
        new webpack.ProvidePlugin({
            'constants': 'constants'
        }),
        new webpack.DefinePlugin({
            'INCLUDE_ALL_MODULES': function includeAllModulesGlobalFn(modulesArray, application) {
                console.log('including all modules:', modulesArray, application);
                modulesArray.forEach(function executeModuleIncludesFn(moduleFn) {
                    moduleFn(application);
                });
            }
        })
    ],
    module: {
        loaders: [
            {
                // This will automatically compile any .es6 files to .js
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                // This handles all your .js files
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "jshint-loader",
                enforce: 'pre'
            },
            {
                // This compiles all .scss files to .css
                // also points to assets/css/loader which compiles
                // globals from app.scss to app.css and makes them
                // avail to all components without separate requires
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader?sourceMap!resolve-url-loader?sourceMap!sass-loader?sourceMap!' + path.resolve('./assets/css/loader')
            },
            {
                // This compiles component html templates into the bundle
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            },
            {
                // This will bundle small images or include larger ones
                // (limit 30000)
                test    : /\.(png|jpg|svg)$/,
                exclude: /node_modules/,
                include : path.join(__dirname, './assets/images'),
                loader  : 'resolve-url-loader?limit=30000&name=images/[path][name].[ext]'
            },
            {
                // This allows us to import .json files as modules
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    }
}