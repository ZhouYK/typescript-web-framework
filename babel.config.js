const plugins = [
  ['@babel/plugin-transform-runtime', {
    corejs: 3,
  }],
  [
    'import',
    {
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: true,
    },
    'ant',
  ],
];

module.exports = {
  presets: [
    ['@babel/preset-react', {
      runtime: 'automatic',
    }],
    [
      '@babel/preset-env',
      {
        modules: 'auto',
        useBuiltIns: 'usage',
        corejs: '3.9',
      },
    ],
  ],
  plugins,
};
