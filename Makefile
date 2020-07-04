RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(RUN_ARGS):;@:)

## make release (major|minor|patch)
release:	
	echo ${RUN_ARGS}
	yarn version --${RUN_ARGS}
	git push origin --follow-tags


$(eval ASSET_IMAGE=localhost/lkassets2:latest)
buildassets:
	$(eval IMAGE=localhost/layerkeep:test1)
	DOCKER_BUILDKIT=1 docker build --progress=plain -f Dockerfile.app --cache-from ${ASSET_IMAGE} -t localhost/lkassets2:latest --target assets . 

# DOCKER_BUILDKIT=1 docker build -f Dockerfile.app --cache-from localhost/assets:latest --build-arg BUILDKIT_INLINE_CACHE=1 -t localhost/assets:latest --target assets . 


buildfinal:	
	$(eval IMAGE=localhost/layerkeep:test3)
	DOCKER_BUILDKIT=1 docker build -f Dockerfile.app --cache-from localhost/assets:latest --cache-from ${ASSET_IMAGE} -t ${IMAGE} --target final .
