FROM ruby:2.6.6-slim-stretch as main

RUN apt-get update && apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
# RUN apt-get update && apt-get install -y cmake npm
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    npm \
    libpq-dev \
    vim \
    libmagic-dev \
    pkg-config \
    git
RUN npm install yarn --global


# Set an environment variable where the Rails app is installed to inside of Docker image
ENV RAILS_ROOT ${RAILS_ROOT:-/var/www/layerkeep}
ENV APP_DIR=${RAILS_ROOT}/app

RUN mkdir -p $RAILS_ROOT 
RUN mkdir ${APP_DIR}
# Set working directory
WORKDIR $RAILS_ROOT

# Setting env up
ARG RAILS_ENV=${RAILS_ENV:-production}
ENV RAILS_ENV=$RAILS_ENV
ENV RACK_ENV=${RAILS_ENV}

# Adding gems
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
# RUN bundle install --jobs 20 --retry 5 --without test 
RUN if [ "$RAILS_ENV" = "production" ] ; then bundle install --deployment --jobs 20 --retry 5 --without test; else bundle install --jobs 20 --retry 5 --without test 
# Adding project files

COPY package.json yarn.lock ./

RUN if [ "$RAILS_ENV" = "production" ] ; then yarn install --check-files --production=true ; else yarn install --check-files ; fi

ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE=${SECRET_KEY_BASE}

COPY . .

# RUN yarn install --check-files --production=true
RUN git config --global user.email web@layerkeep.com && git config --global user.name LayerKeep

# RUN chmod +x "${APP_DIR}/services/scripts/scad.sh"

# VOLUME [ "${APP_DIR}", "${RAILS_ROOT}/config" ]

# VOLUME [ "${RAILS_ROOT}/public", "/var/www/repos" ]



VOLUME [ "${APP_DIR}", "${RAILS_ROOT}/config" ]

VOLUME [ "${RAILS_ROOT}/public", "/var/www/repos" ]


EXPOSE 3000


CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]




# RUN PRECOMPILE_ASSETS=true RAILS_ENV=${RAILS_ENV} bundle exec rake assets:precompile

# ENV PRECOMPILE_ASSETS=false
# RUN yarn install --check-files --production=true


