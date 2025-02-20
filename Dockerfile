# Step 1: Build the React app
FROM node:18 as build-stage
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install -g vite
RUN npm install framer-motion react-icons jwt-decode

COPY . .


RUN npm run build

# Step 2: Serve the app with a lightweight web server
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
