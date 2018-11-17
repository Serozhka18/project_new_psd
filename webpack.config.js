const path                      = require('path');
const webpack                   = require('webpack');
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin   = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const ImageminPlugin            = require('imagemin-webpack-plugin').default;

module.exports = {
    // base source path
    context: path.resolve(__dirname, 'src'),

    // entry file names to compile
    entry: {  
        app: [
            './js/app.js',
            './scss/theme.scss'
        ]
    },

    // compiled files path
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "../"
    },

    // enable source maps
    devtool: 'inline-source-map',

    // directory for starting webpack dev server
    devServer: {
        contentBase: './',
        inline:true,
        port: 3002
    },

    // connect other plugins
    plugins: [
        new MiniCssExtractPlugin({filename: "./css/[name].css"}),
        new CopyWebpackPlugin([{from: './img/static/', to: './img/static/'}]),
        new ImageminPlugin({ test: /\.(jpe?g|png|gif)$/i }),

        // jQuery global plugin
        new webpack.ProvidePlugin({   
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        })
    ],

    // optimizing configuration
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
        ]
    },

    // setting up file extensions handlers
    module: {
        rules: [
            // Styles loader
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.(png|jpe?g|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {name: '[path][name].[ext]'},
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        {removeTitle: true},
                                        {convertPathData: false}
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',    // where the fonts will go
                        publicPath: '../'       // override the default path
                    }
                }]
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
            // SVG converter into 'data:image'
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
            },
            {
                test: /\.(jpe*g|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    }
};
