FROM node:10-slim as base
ENV NODE_ENV=production
EXPOSE 3000
ENV PORT 3000
WORKDIR /node
COPY package*.json ./
RUN npm config list
RUN npm ci \
    && npm cache clean --force
ENV PATH /node/node_modules/.bin:$PATH

FROM base as dev
ENV NODE_ENV=development
RUN npm config list
RUN npm install --only=development \
    && npm cache clean --force
WORKDIR /node/app
USER node
CMD ["nodemon", "--watch", "src", "--ext", "ts", "--exec", "node --inspect -r ts-node/register -r tsconfig-paths/register ./src/index.ts"]

FROM dev as test
COPY . .
RUN npm audit
RUN tsc --noEmit
RUN npm test
CMD ["jest", "--watchAll"]

FROM test as scan
ARG CACHEBUST=1
ARG MICROSCANNER_TOKEN
USER root
RUN apt-get update && apt-get -y install ca-certificates
ADD https://get.aquasec.com/microscanner /
RUN chmod +x /microscanner
RUN /microscanner ${MICROSCANNER_TOKEN}
RUN echo "No vulnerabilities!"

FROM scan as pre-prod
COPY . .
RUN npm run build

FROM base as prod
COPY --from=pre-prod /node /node
WORKDIR /node/app/dist
USER node
CMD ["node", "index.js"]