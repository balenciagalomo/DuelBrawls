###################
# BUILD FOR PRODUCTION
###################

FROM node:22.6.0 As build
RUN npm i -g pnpm @nestjs/cli

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

COPY --chown=node:node . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter server build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:22.6.0-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/apps/server/node_modules ./apps/server/node_modules

CMD [ "node", "apps/server/dist/main.js" ]
