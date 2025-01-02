FROM node:latest 
# as build
WORKDIR /samplescape

ENV PATH /samplescape/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent

COPY . /samplescape/
RUN npm run build
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-p", "3000"]

#FROM nginx:stable
#COPY --from=build /samplescape/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]