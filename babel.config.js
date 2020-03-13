module.exports = {
	// presets: [ [ "@vue/app", { useBuiltIns: "entry" } ] ]
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise', // already default included now
        'es6.array.iterator', // already default included now
        'es6.symbol',
        'es6.object.assign',
        'es6.array.find-index',
        'es6.function.name',
        'es6.object.to-string',
        'web.dom.iterable',
      ],
      useBuiltIns: "entry"
    }]
  ],
  plugins: ["@babel/plugin-transform-runtime"]
};


