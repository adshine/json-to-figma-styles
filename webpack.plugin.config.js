const path = require('path');
const fs = require('fs');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './code.ts',
    output: {
      filename: 'code.js',
      path: path.resolve(__dirname),
      clean: false,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      {
        apply: (compiler) => {
          compiler.hooks.emit.tapAsync('HTMLInjectionPlugin', (compilation, callback) => {
            // Read the UI HTML file
            const uiHtmlPath = path.resolve(__dirname, 'ui.html');
            if (!fs.existsSync(uiHtmlPath)) {
              console.error('❌ ui.html not found at:', uiHtmlPath);
              console.error('   Please run: npm run build:ui');
              callback();
              return;
            }

            let uiHtml = fs.readFileSync(uiHtmlPath, 'utf8');

            // Escape backticks and backslashes for template literal
            uiHtml = uiHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

            // Inject the HTML into the plugin code
            const source = compilation.assets['code.js'].source();
            const injectedSource = source.replace(
              /__html__/g,
              `\`${uiHtml}\``
            );

            compilation.assets['code.js'] = {
              source: () => injectedSource,
              size: () => injectedSource.length,
            };

            console.log('✅ Injected UI HTML into plugin code');
            callback();
          });
        },
      },
    ],
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
  };
};
