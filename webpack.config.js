const config = {
  mode: 'production',
  entry: {
    index: './source/js/index.js',
    //для подключения JS на другие страницы при необходимости
    // в формате: name.js: 'адрес файла.js'
    // catalog: './source/js/catalog.js',
    // form: './source/js/form.js',
  },
  output: {
    // filename: '[name].bundle.js',
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

module.exports = config;
