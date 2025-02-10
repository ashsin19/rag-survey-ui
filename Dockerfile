# Step 1: Build the React app
FROM node:18 as build-stage
WORKDIR /app
COPY package.json ./
RUN npm install && npm list vite
COPY . .
RUN npm run build

# Step 2: Serve the app with a lightweight web server
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
