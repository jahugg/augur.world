import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config();
const db = new Database('/Users/gaskar/Documents/augur.sqlite');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Endpoint to fetch precipitation/flooding data from database
 * @param  {String} lat latitude of location
 * @param  {String} lng longitude of location
 * @return {JSON} json object containing precipitation/flooding data for location
 */
app.get('/api/location', async (req, res) => {
  const { lat, lng } = req.query;
  const dbResult = await selectLocation(lat, lng);
  // const parsedResult = JSON.parse(dbResult.data);
  console.log(dbResult);
  // const parsedResult = {};
  res.json(dbResult);
});

app.listen(process.env.PORT);

/**
 * Select location entry from local database
 * @param  {String} lat latitude of location
 * @param  {String} lng longitude of location
 */
async function selectLocation(lat, lng) {
  try {
    // console.log(`SELECT latitude, longitude FROM augur ORDER BY ABS(latitude - ${lat}), ABS(longitude - ${lng}) LIMIT 1`);
    const result = db.prepare(`SELECT * FROM augur ORDER BY ABS(latitude - ${lat}), ABS(longitude - ${lng}) LIMIT 1`).get();
    // const result = await query.get(lat, lng);

    console.log(result);
    const years = [2030, 2040, 2050];
    const periods = [10, 20, 30, 50, 100];
    
    const data = { period: 
      years.reduce((acc, year) => {
        acc[year] = {
          years: periods.reduce((acc, period) => {
            acc[period] = {
              present: result[`year${period}`],
              climate_change: result[`year${period}_cchange${year}`]
            }

            return acc;
          }, {})
        }
        return acc;
        
      }, {})};
    
    console.log(JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.log(error);
  }
}

/*

{
    "period": {
      "2030": {
        "years": {
          "10": {
            "present": "88",
            "climate_change": "94"
          },
          "20": {
            "present": "99",
            "climate_change": "105"
          },
          "30": {
            "present": "112",
            "climate_change": "120"
          },
          "50": {
            "present": "122",
            "climate_change": "128"
          },
          "100": {
            "present": "125",
            "climate_change": "133"
          }
        }
      },
      "2040": {
        "years": {
          "10": {
            "present": "88",
            "climate_change": "94"
          },
          "20": {
            "present": "99",
            "climate_change": "105"
          },
          "30": {
            "present": "99",
            "climate_change": "105"
          },
          "50": {
            "present": "99",
            "climate_change": "105"
          },
          "100": {
            "present": "99",
            "climate_change": "105"
          }
        }
      },
      "2050": {
        "years": {
          "10": {
            "present": "88",
            "climate_change": "94"
          },
          "20": {
            "present": "99",
            "climate_change": "105"
          },
          "30": {
            "present": "99",
            "climate_change": "105"
          },
          "50": {
            "present": "99",
            "climate_change": "105"
          },
          "100": {
            "present": "99",
            "climate_change": "105"
          }
        }
      }
    }
  }
  */
