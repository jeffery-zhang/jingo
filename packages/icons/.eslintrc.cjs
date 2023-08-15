module.exports = {
  root: true,
  extends: [
    '@jingo/eslint-config',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
  },
  ignorePatterns: ['node_modules/*', 'iconfont.js'],
}
