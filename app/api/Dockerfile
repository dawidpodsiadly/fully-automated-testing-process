FROM node:22
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3050
CMD ["node", "src/server.js"]
