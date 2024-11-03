# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json yarn.lock /app/

# Install dependencies
RUN yarn install

# Copy project files
COPY . /app/

# Build the Next.js app
RUN yarn build

# Expose the Next.js port
EXPOSE 3000

# Start the app
CMD ["sh", "-c", "yarn", "start"]
