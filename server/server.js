import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.get('/', (requ, res) => {
  res.send('Hello');
});

app.listen(process.env.PORT);
