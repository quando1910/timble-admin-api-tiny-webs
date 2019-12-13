 # Create image based on the official Node 6 image from the dockerhub
FROM node:12

# Create a directory where our app will be placed
RUN mkdir -p /timble-tinyweb-api

# Change directory so that our commands run inside this new directory
WORKDIR /timble-tinyweb-api

# Copy dependency definitions
COPY package.json /timble-tinyweb-api
COPY . /timble-tinyweb-api

# Install dependecies
RUN npm install
RUN npm install bcrypt
EXPOSE 3013

# Get all the code needed to run the app
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# Expose the port the app runs in
CMD /wait && npm start
