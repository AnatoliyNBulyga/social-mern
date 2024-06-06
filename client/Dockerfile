FROM node:19.5.0-alpine AS build

WORKDIR /project

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp -r build /app_build

FROM nginx:stable-alpine

COPY --from=build /app_build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]