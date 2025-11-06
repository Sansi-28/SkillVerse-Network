# --- Build Stage ---
# Use an official Node.js image to build the React app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# The build script needs the backend URL as an environment variable
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the static files for production
RUN npm run build


# --- Run Stage ---
# Use an official Nginx image to serve the static files
FROM nginx:1.23-alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the 'build' stage to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port Nginx runs on
EXPOSE 80

# The command to start Nginx
CMD ["nginx", "-g", "daemon off;"]