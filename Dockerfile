FROM node:22.6.0 As build

# Specify the ENV variables
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG JWT_SECRET
ARG JWT_TTL

RUN npm i -g pnpm @nestjs/cli

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

COPY --chown=node:node . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter server build

ENV NODE_ENV production

USER node

CMD [ "pnpm", "--filter", "server", "start:prod" ]