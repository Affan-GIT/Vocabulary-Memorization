const express = require('express');
require('dotenv').config();
const router = require('./router.js');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api/v1', router);

const start = async () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

start();
