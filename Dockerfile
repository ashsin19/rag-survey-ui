# Step 1: Build the React app
FROM node:18 as build-stage
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install -g vite

COPY . .

RUN npm run build

# Step 2: Serve the app with a lightweight web server
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

RUN echo '{ "REACT_APP_BACKEND_URL": "https://python-rag-app-369543119888.us-central1.run.app" }' > /usr/share/nginx/html/runtime-config.json

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
