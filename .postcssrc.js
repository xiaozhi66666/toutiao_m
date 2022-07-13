// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 设计稿1rem的大小，视口1/10宽
      // rootValue: 37.5,
      rootValue: (module) => (/vant/gi.test(module.file) ? 37.5 : 75),
      // console.log(module);
      // 适配的属性，可以指定包括height/witdh/padding等...
      propList: ['*']
    }
  }
}
