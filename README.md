# Augur.world
World map for flood risk and precipitation event prediction

# Tooling Info
- JavaScript runtime: [NodeJS](https://nodejs.org/)
- Web Server Framework: [ExpressJS](https://expressjs.com/)
- Database: [sqlite](https://sqlite.org/index.html)
- Web build tool: [ParcelJS](https://parceljs.org/)

# Preperation
- Install nodeJS https://nodejs.org/
- Install yarn package manager via npm (bundled with nodeJS)
```shell
npm install --global yarn
```

# Installation
- Clone Augur Repository 
```shell
cd myDir
git clone `https://github.com/jahugg/augur.world.git`
```
- cd into directory and install dependencies
```shell
cd myDir
yarn install
```

# Set environment variables
- create `.env` file in `myDir/client` directory with desired SERVER URL variable

example:
`SERVER=http://localhost:3000`

- create `.env` file in `myDir/server` directory with corresponding PORT variable

example:
`PORT=3000`

# Run Application
- Start Client
```shell
cd myDir/client
yarn start
```
- Start Server
```shell
cd myDir/server
yarn nodemon server.js
```

# Open Application
Open your Web browser and go to http://localhost:1234/
