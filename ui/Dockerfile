# Use the official Node.js v14 image as the base image
FROM node:18.13.0

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the rest of the app's files to the container
COPY . .

# Build the app for production
RUN npm run build

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV production

# Expose port 3000
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
