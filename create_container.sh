# docker run \
#   --env-file .env \
#   --name bitrix-tasks-commits \
#   -v ${PWD}:/code \
#   -w /code \
#   -it \
#   node:16.13.1-bullseye \
#   /bin/bash


docker run \
  -i --init \
  --rm \
  --cap-add=SYS_ADMIN \
   --name puppeteer-chrome \
   bitrix-tasks-commits \
   node -e "`cat index.js`"