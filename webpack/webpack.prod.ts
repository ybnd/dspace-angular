import { projectRoot } from './helpers';
import { commonExports } from './webpack.common';

const webpack = require('webpack');

module.exports = Object.assign({}, commonExports, {
  plugins: [
    ...commonExports.plugins,
    new webpack.EnvironmentPlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        AOT: true,
      },
    }),
  ],
  mode: 'production',
  recordsOutputPath: projectRoot('webpack.records.json'),
  entry: projectRoot('./server.ts'),
  target: 'node',
});
