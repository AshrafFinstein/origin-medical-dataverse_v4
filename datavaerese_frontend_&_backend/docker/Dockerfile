FROM node:18.15

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . .

RUN apt-get -qy update
RUN apt-get -qy install \
  apt-utils \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev \
  build-essential \
  g++ \
  openssl

RUN npm ci --build-from-source && npm cache clean --force

RUN npm run prepare
RUN npm run prisma:generate
RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

RUN npm install -g dotenv-cli

CMD [ "npx", "dotenv", "-e", ".env", "npm", "run" ,"start" ]
