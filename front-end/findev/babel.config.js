module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@components': './src/components', // Replace with your desired aliases
          '@utils': './src/utils',
          // Add more aliases as needed
        },
      },
    ],
  ],
};
