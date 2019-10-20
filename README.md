# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

INSTALL NGINX LOCALLY

brew tap denji/nginx
brew install nginx-full --with-auth-req



docker run -it -p 3000:3000 \
  -v /frenzylabs/layerkeep_services/layerkeep/public/assets:/var/www/layerkeep/app/public/assets \
  -e SECRET_KEY_BASE=c959724279db5ca746e7a87 \
  -e PG_HOST=host.docker.internal \
  -e PG_PASSWORD=admin123 \
  -e PG_USERNAME=postgresadmin \
  -e PG_DATABASE=layerkeep \
localhost/layerkeepweb:latest /bin/bash
bundle exec rails assets:precompile




ADMIN:

rails generate active_admin:resource Contact