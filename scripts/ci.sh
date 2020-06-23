#!/bin/bash
set -eox pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT_DIR="$( cd "$( dirname "${SCRIPT_DIR}" )" >/dev/null 2>&1 && pwd )"


docker_build_target() {
  IMAGE=${IMAGE:?'IMAGE must be set'}

  docker build -f ${ROOT_DIR}/Dockerfile -t ${IMAGE} .
  docker push ${IMAGE}
}

docker_build_assets() {
    mkdir ${SCRIPT_DIR}/assets/public
    docker run --rm \
	-v ${SCRIPT_DIR}/assets/public:/var/www/layerkeep/public \
    -e SECRET_KEY_BASE=c959724279db5ca746e7a87 \
	-e RAILS_ENV=production \
	-e PRECOMPILE_ASSETS=true \
	${IMAGE} -- bundle exec rails assets:precompile
    docker build -f ${SCRIPT_DIR}/assets/Dockerfile -t ${ASSET_IMAGE} ${SCRIPT_DIR}/assets
}