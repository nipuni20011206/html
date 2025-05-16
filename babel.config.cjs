module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }], // For Jest environment
    ['@babel/preset-react', { runtime: 'automatic' }]      // For JSX
  ],
  plugins: [
    'babel-plugin-transform-vite-meta-env' // This transforms import.meta.env to process.env
  
  ]
};