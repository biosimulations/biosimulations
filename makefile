DOCKER_BUILD_CONTEXT=.
DOCKER_BACKEND_PATH=./Dockerfile
DOCKER_FRONTEND_PATH=./deploy/docker/frontend.dockerfile
DOCKER_PATH=$(DOCKER_BACKEND_PATH)
DOCKER_REGISTRY=docker.io
DOCKER_USER=crbm
APP=biosimulations-api
DOCKER_IMAGE=$(DOCKER_HOST)/$(DOCKER_USER)/$(APP)
COMMIT=$(shell git rev-parse HEAD)
TAG=$(COMMIT)
ENV=production

all: biosimulations-api account-api biosimulations-dispatch-service
.PHONY: all

deploy: push-biosimulations-api push-account-api push-biosimulations-dispatch-service
.PHONY: deploy

build: 
	docker  build -f $(DOCKER_PATH) -t crbm/$(APP):$(TAG) --build-arg app=$(APP) $(DOCKER_BUILD_CONTEXT)
.PHONY: build

push: build 
	docker push crbm/$(APP):$(TAG)
.PHONY: push



biosimulations-api:
					$(MAKE) build APP=biosimulations-api TAG=$(TAG)
.PHONY: biosimulations-api

account-api: 
			$(MAKE) build APP=account-api TAG=$(TAG)

.PHONY: account-api

biosimulations-dispatch-service:
			$(MAKE) build APP=biosimulations-dispatch-service TAG=$(TAG)

push-biosimulations-api:
					$(MAKE) push APP=biosimulations-api TAG=$(TAG)
.PHONY: biosimulations-api

push-account-api: 
			$(MAKE) push APP=account-api TAG=$(TAG)

.PHONY: account-api

push-biosimulations-dispatch-service:
			$(MAKE) push APP=biosimulations-dispatch-service TAG=$(TAG)
