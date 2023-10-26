# Stage 1; build and compile the frontend
FROM public.ecr.aws/bitnami/node:18 as build-stage
RUN apt-get update
RUN apt-get install -y build-essential
ARG NPM_TOKEN
ARG PROJECT_NPM_TOKEN
ARG BUILD_PROFILE=dev
ENV PRODUCTION=false
ENV SHOULD_ENCRYPT=false
ENV APP_HOST_URL=default
ENV PLATFORM_MODULE_API_URL=default
ENV USER_MODULE_API_URL=default
ENV ORGANIZATION_MODULE_API_URL=default
ENV NMM_MODULE_API_URL=default
ENV DMM_MODULE_API_URL=default
ENV CRM_MODULE_API_URL=default
ENV EMM_MODULE_API_URL=default
ENV JANKEC_MODULE_API_URL=default
ENV JWT_CLIENT_ID=default
ENV JWT_CLIENT_SECRET=default
ENV AZURE_AUTH_ENABLED=false
ENV AZURE_AUTH_CLIENT_ID=default
ENV AZURE_AUTH_TENANT_ID=default
ENV FIREBASE_API_KEY=default
ENV FIREBASE_AUTH_DOMAIN=default
ENV FIREBASE_DATABASE_URL=default
ENV FIREBASE_PROJECT_ID=default
ENV FIREBASE_STORAGE_BUCKET=default
ENV FIREBASE_MESSAGING_SENDER_ID=default
ENV FIREBASE_APP_ID=default
ENV FIREBASE_MEASUREMENT_ID=default
ENV FIREBASE_VAPID_KEY=default
ENV FIREBASE_RECAPTCHA_SITE_KEY=default
ENV FIREBASE_RECAPTCHA_SECRET_KEY=default
ENV LOG_TO_LOKI=false
ENV LOGSTASH_HOST_URL=default
ENV LOKI_LOG_URL=default
WORKDIR /app
COPY package.json ./package-lock.json decorate-angular-cli.js .npmrc ./
RUN sed -i "s/\${NPM_TOKEN}/${NPM_TOKEN}/g" .npmrc
RUN sed -i "s/\${PROJECT_NPM_TOKEN}/${PROJECT_NPM_TOKEN}/g" .npmrc
RUN npm install -g nx
RUN npm ci --legacy-peer-deps
COPY . .
RUN nx build --project=jankecapp --configuration=$BUILD_PROFILE --output-path=/app/dist/out

# Stage 2; nginx
FROM public.ecr.aws/nginx/nginx
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
RUN export FILE_NAME=$(ls /usr/share/nginx/html | grep 'main\.' | head -n 1); echo "envsubst '\$PRODUCTION \$SHOULD_ENCRYPT \$APP_HOST_URL \$PLATFORM_MODULE_API_URL \$USER_MODULE_API_URL \$ORGANIZATION_MODULE_API_URL \$NMM_MODULE_API_URL \$DMM_MODULE_API_URL \$CRM_MODULE_API_URL \$EMM_MODULE_API_URL \$JANKEC_MODULE_API_URL \$JWT_CLIENT_ID \$JWT_CLIENT_SECRET \$AZURE_AUTH_ENABLED \$AZURE_AUTH_CLIENT_ID \$AZURE_AUTH_TENANT_ID \$FIREBASE_API_KEY \$FIREBASE_AUTH_DOMAIN \$FIREBASE_DATABASE_URL \$FIREBASE_PROJECT_ID \$FIREBASE_STORAGE_BUCKET \$FIREBASE_MESSAGING_SENDER_ID \$FIREBASE_APP_ID \$FIREBASE_MEASUREMENT_ID \$FIREBASE_VAPID_KEY \$FIREBASE_RECAPTCHA_SITE_KEY \$FIREBASE_RECAPTCHA_SECRET_KEY \$LOG_TO_LOKI \$LOGSTASH_HOST_URL \$LOKI_LOG_URL' < \/usr/share/nginx/html/$FILE_NAME > maintmp.js && \
  mv maintmp.js \/usr/share/nginx/html/$FILE_NAME && nginx -g 'daemon off;'" > run.sh
ENTRYPOINT ["sh", "run.sh"]
