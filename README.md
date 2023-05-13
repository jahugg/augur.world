# Augur.world
World map for extreme precipitation under climate climate

# Tooling Info
- JavaScript runtime: [NodeJS](https://nodejs.org/)
- Web Server Framework: [ExpressJS](https://expressjs.com/)
- Database: [sqlite](https://sqlite.org/index.html)
- Web build tool: [ParcelJS](https://parceljs.org/)

# Preperation
- Install nodeJS https://nodejs.org/ (>16)
- Install yarn package manager via npm (bundled with nodeJS)
```shell
npm install --global yarn
```

# Installation

- Clone repository and go to client
```shell
cd augur.world
cd client
```

- Create .env file with content
```shell
cat -env "SERVER=http://localhost:3000/api"
npm install
npm run build
npm run start-server
```

- Note that http://localhost:3000/api is the endpoint for api, so if you start your server in a different port you need to set it accordingly, or in production, just set the actual url.
- Go to main folder, then
```shell
cd server
```

- Create .env file with content
```shell
PORT=3000
DB_PATH=/Users/gaskar/Documents/augur.sqlite
npm install
npm start
```

# Run Application
```shell
pm2 start "npm run start-server" --name client
pm2 start --name server server.js
```

# Open Application
Open your Web browser and go to http://localhost:1234/
