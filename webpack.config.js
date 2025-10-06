const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/ui/index.tsx',
    output: {
      filename: 'ui.bundle.js',
      path: path.resolve(__dirname),
      clean: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/ui/index.html',
        filename: 'ui.html',
        inject: 'body',
        scriptLoading: 'blocking', // Load script synchronously
      }),
      // Custom plugin to inline the JavaScript
      {
        apply: (compiler) => {
          compiler.hooks.compilation.tap('InlineChunksHtmlPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
              'InlineChunksHtmlPlugin',
              (data, cb) => {
                // Inline all script tags
                data.bodyTags = data.bodyTags.map((tag) => {
                  if (tag.tagName === 'script' && tag.attributes && tag.attributes.src) {
                    const scriptName = path.basename(tag.attributes.src);
                    const asset = compilation.assets[scriptName];
                    if (asset) {
                      // Replace with inline script
                      return {
                        tagName: 'script',
                        innerHTML: asset.source(),
                        closeTag: true,
                      };
                    }
                  }
                  return tag;
                });
                cb(null, data);
              }
            );
          });
        },
      },
    ],
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
  };
};
