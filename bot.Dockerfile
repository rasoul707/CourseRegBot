# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Prisma
RUN npx prisma generate

# Build bot
RUN npm run build:bot

# Define the command to run the bot
CMD ["npm", "run", "start:bot"]
