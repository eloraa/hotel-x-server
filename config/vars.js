const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  dbname: process.env.DB_NAME,
  favicon: '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none"> <style> path { fill: black; } @media (prefers-color-scheme: dark) { path { fill: white; } } </style> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4745 2.5H28.1877V15.2462C22.8083 16.189 19.3388 18.6736 17.2179 21.57C16.948 21.9386 16.7006 22.3129 16.4745 22.6903V2.5ZM14.4745 2.5H2.18774V15.1891C7.76145 16.0853 11.3323 18.613 13.4975 21.57C13.8636 22.07 14.1881 22.5802 14.4745 23.0945L14.4745 2.5ZM2.18774 17.217V28.5H14.2324C13.9726 26.7379 13.2793 24.6572 11.8839 22.7516C10.0909 20.3029 7.09088 18.077 2.18774 17.217ZM15.4239 30.5C15.4301 30.5 15.4363 30.5 15.4425 30.5C15.4487 30.5 15.4549 30.5 15.4611 30.5H28.1877H30.1877V28.5V16.1284C30.1878 16.1282 30.1878 16.1279 30.1878 16.1276L30.1877 16.1274V2.5V0.5H28.1877H2.18774H0.187744V2.5V28.5V30.5H2.18774H15.4239ZM28.1877 17.2794V28.5H16.483C16.7429 26.7379 17.4362 24.6572 18.8316 22.7516C20.5828 20.36 23.4853 18.1809 28.1877 17.2794Z" fill="#DCFF50" /> </svg>'
};
