FROM NODE:20

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000