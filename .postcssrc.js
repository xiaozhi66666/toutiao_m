// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 设计稿1rem的大小，视口1/10宽
      // rootValue: 37.5,
    //   使用正则判断module.file路劲中是否包含vant，如果包含就使用37.5，否则就是用自己的1倍视图的1/10视口宽度
      rootValue: (module) => (/vant/gi.test(module.file) ? 37.5 : 75),
      // console.log(module);
      // 适配的属性，可以指定包括height/witdh/padding等...
      propList: ['*']
    }
  }
}
