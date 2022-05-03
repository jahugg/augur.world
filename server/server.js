import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config();
const db = new Database('./data.db');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Endpoint to fetch precipitationa nd flooding data from database
 * @param  {String} lat latitude of location
 * @param  {String} lng longitude of location
 * @return {JSON} json object with precipitation and flooding data for location
 */
app.get('/api/location', async (req, res) => {
  const { lat, lng } = req.query;
  const dbResult = await selectLocation(lat, lng);
  const parsedResult = JSON.parse(dbResult.data);
  res.json(parsedResult);
});

app.listen(process.env.PORT);

/**
 * Select location entry from local database
 * @param  {String} lat latitude of location
 * @param  {String} lng longitude of location
 */
async function selectLocation(lat, lng) {
  try {
    const query = db.prepare('SELECT * FROM augur WHERE latitude = ? AND longitude = ?');
    const result = query.get(lat, lng);
    return result;
  } catch (error) {
    console.log(error);
  }
}
