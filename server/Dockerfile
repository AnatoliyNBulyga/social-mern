# use image linux apline with the version of node 14
FROM node:19.5.0-alpine

# set our work folder
WORKDIR /app

# copy package.json and package-lock.json into the container
COPY package*.json ./

# install dependesies
RUN npm install

# copy rest application into the container
COPY . .

# install prisma
RUN npm install -g prisma

# generate prisma client
RUN prisma generate

# copy Prisma schema into the container
COPY prisma/schema.prisma ./prisma/

# open port 3000 in our container
EXPOSE 3000

# run the server
CMD [ "npm", "start" ]