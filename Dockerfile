FROM node:16.6.0

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# install dependencies
RUN npm install

# tell the port number the container should expose
EXPOSE 3000

# run the command
CMD ["npm", "run", "dev"]
