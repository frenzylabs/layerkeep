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

## Start Dependencies 
In terminal go to /frenzylabs/layerkeep-infra
1. Setup Aws Authentication to have access to the secrets
  Copy .saml2aws to /root/ or copy the content into /root/.saml2aws if it already exist.  
  Update username to be your frenzylabs email address. 
2. Run `saml2aws login` and follow prompts

3. Run rabbitmq
   `make localdev setup-rabbitmq`

4. Setup Repo Directory
  `skaffold deploy -p repo`

5. Run nginx
   `make localdev setup-nginx`
   `make localdev setup-ingress`

6. Run Postgres
   `make localdev setup-postgres init=true`

7. skaffold dev

8.  Run migrations  
    `make localdev run-database-migrations -f ../../layerkeep-infra/Makefile`


9.  Setup host file
    Edit /etc/hosts and add 127.0.0.1 layerkeep.local, www.layerkeep.local, admin.layerkeep.local




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