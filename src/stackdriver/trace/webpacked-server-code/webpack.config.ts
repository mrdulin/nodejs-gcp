import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import path from 'path';

const config = {
  mode: 'none',
  entry: './src/main.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules', 'src']
  },
  optimization: {
    nodeEnv: false
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: 'awesome-typescript-loader'
      }
    ]
  },
  externals: [nodeExternals()]
};

export default config;
