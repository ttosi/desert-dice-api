#!/bin/bash

cd ..
echo PWD

# get environment from args
ENVIRONMENT=$1
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "prod" ]]; then
  echo "❌ Usage: ./deploy.sh [staging|production]"
  exit 1
fi

ENV_FILE=".env.$ENVIRONMENT"

echo "deploying with" $ENV_FILE

# create temp-deploy if not exists
if [ ! -d "temp-deploy" ]; then
	mkdir temp-deploy
else
	rm -rf temp-deploy/*
fi

# build ui based on environment
echo "Building ui for" $ENVIRONMENT"..."
cd ./desert-dice-ui && yarn build:$ENVIRONMENT && cd ..

# copy local api files to temp-deploy
# install -D ./desert-dice-api/src/api/* ./temp-deploy/api/
echo "Copying api to temp deploy folder..."
cp -R ./desert-dice-api/src/* ./temp-deploy/.
cp ./desert-dice-api/app.js ./temp-deploy/
sed -i 's|\.\/src\/|.\/|g' ./temp-deploy/app.js
cp ./desert-dice-api/.env.$ENVIRONMENT ./temp-deploy/.env
cp ./desert-dice-api/package.json ./temp-deploy/.

# copy site files from local to remote
echo "Copying files to server..."
rsync -avz -e "ssh -i ~/.ssh/ssh_hetzner" ./temp-deploy/ ttosi@5.78.41.98:~/sites/desertdiceco.com/$ENVIRONMENT
rsync -avz -e "ssh -i ~/.ssh/ssh_hetzner" ./desert-dice-api/public/ ttosi@5.78.41.98:~/sites/desertdiceco.com/$ENVIRONMENT/public

# install modules
echo "Installing node modules on server..."
ssh -i ~/.ssh/ssh_hetzner ttosi@5.78.41.98 "cd ~/sites/desertdiceco.com/"$ENVIRONMENT " && npm i"

# start or restart pm2 desertdice instance
if ssh -i ~/.ssh/ssh_hetzner ttosi@5.78.41.98 "pm2 show desertdice-${ENVIRONMENT} 2>&1 | grep doesn\'t"; then
  echo "pm2 ${ENVIRONMENT} instance does not exist, starting..."
  ssh -i ~/.ssh/ssh_hetzner ttosi@5.78.41.98 "mkdir -p ~/sites/desertdiceco.com/${ENVIRONMENT}/logs"
  ssh -i ~/.ssh/ssh_hetzner ttosi@5.78.41.98 "pm2 start ~/sites/desertdiceco.com/${ENVIRONMENT}/app.js --name desertdice-${ENVIRONMENT} --output ~/sites/desertdiceco.com/${ENVIRONMENT}/logs/out.log --error ~/sites/desertdiceco.com/$ENVIRONMENT/logs/err.log && pm2 save"
else
  echo "${ENVIRONMENT} pm2 instance exists, resterting..."
  ssh -i ~/.ssh/ssh_hetzner ttosi@5.78.41.98 "pm2 restart desertdice-${ENVIRONMENT}"
fi