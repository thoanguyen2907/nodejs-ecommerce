
require('dotenv').config()

const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.LOCAL_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME_DEV,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
  },
  db: {
    host: process.env.LOCAL_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME_PRO,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
