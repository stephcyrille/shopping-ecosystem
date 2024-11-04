# Use Node.js as the base image
FROM node:20.9.0

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to leverage Docker caching
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install 

# Copy the entire app after installing dependencies
COPY . .

# Build the Next.js app
RUN yarn build

# Expose the Next.js port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]

