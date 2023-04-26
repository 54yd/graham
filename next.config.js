/** @type {import('next').NextConfig} */

const webpack = require('webpack');
const path = require('path');
// Initialize doteenv library
//require('dotenv').config();

const nextConfig = {
  //experimental: {
  //  appDir: true,
  //},  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 既存の設定を変更する場合は、config オブジェクトを変更してください。
    // resolve.alias オプションを使用して依存関係を静的に指定する
    //config.resolve.alias['fluent-ffmpeg'] = path.resolve(__dirname, 'node_modules/fluent-ffmpeg');
    
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      })
    );
    // モジュールリクエストを解決するために ContextReplacementPlugin を追加する
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /fluent-ffmpeg(\\|\/)lib/,
        path.resolve(__dirname, 'node_modules/fluent-ffmpeg/lib')
      )
    );

    return config
  }
}

// might better to refer : https://nextjs.org/docs/messages/undefined-webpack-config
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },  
//}

module.exports = nextConfig
