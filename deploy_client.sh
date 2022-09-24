#!/bin/bash
cd ~/augur.world/client/
rm -rf dist
npm run build
pm2 restart client
