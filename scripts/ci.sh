#!/bin/bash
set -eox pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT_DIR="$( cd "$( dirname "${SCRIPT_DIR}" )" >/dev/null 2>&1 && pwd )"


docker_build_target() {
  IMAGE=${IMAGE:?'IMAGE must be set'}

	echo "PWD = $(pwd)"
  echo $(ls)  
  docker build -f ${ROOT_DIR}/Dockerfile -t ${IMAGE} .
	docker run --rm \
		-v ${SCRIPT_DIR}/vendor/bundle:/var/www/layerkeep/bundlecache \
		${IMAGE} /bin/sh -c "cp -rf vendor/bundle/* bundlecache/"
	
	docker run --rm \
		-v ${SCRIPT_DIR}/node_module_cache:/var/www/layerkeep/nodecache \
		${IMAGE} /bin/sh -c "cp -rf node_modules/* nodecache/"
	# echo "$( cp -rf docs ./from_branch/ )"
	echo $(ls ${SCRIPT_DIR}/node_module_cache)

  # docker push ${IMAGE}
}

docker_build_assets() {
    mkdir ${SCRIPT_DIR}/assets/public
    docker run --rm \
		-v ${SCRIPT_DIR}/assets/public:/var/www/layerkeep/public \
    -e SECRET_KEY_BASE=c959724279db5ca746e7a87 \
		-e RAILS_ENV=production \
		-e PRECOMPILE_ASSETS=true \
		${IMAGE} bundle exec rails assets:precompile
    docker build -f ${SCRIPT_DIR}/assets/Dockerfile -t ${ASSET_IMAGE} ${SCRIPT_DIR}/assets
}

push_images() {
    docker push ${IMAGE}
    docker push ${ASSET_IMAGE}
}

$1


docker run --rm \
		-v ${PWD}/vendor/bundle:/var/www/layerkeep/bundlecache \
    -e SECRET_KEY_BASE=c959724279db5ca746e7a87 \
		-e RAILS_ENV=production \
		-e PRECOMPILE_ASSETS=true \
		registry.digitalocean.com/frenzylabs/web:7f1cab2-build cp -rf /usr/local/bundle/* bundlecache/

