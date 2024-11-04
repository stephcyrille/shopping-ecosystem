# Use Node.js as the base image
FROM node:20.9.0

# Set working directory
WORKDIR /app

# Copy dependencies files first for better caching
COPY . .

# Install dependencies
RUN yarn install 

# Build the Next.js app
RUN yarn build

# Expose the Next.js port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]

