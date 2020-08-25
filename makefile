DOCKER_BUILD_CONTEXT=.
DOCKER_BACKEND_PATH=./Dockerfile
DOCKER_FRONTEND_PATH=./deploy/docker/frontend.dockerfile
DOCKER_PATH=$(DOCKER_BACKEND_PATH)
DOCKER_REGISTRY=docker.io
DOCKER_NAMESPACE=biosimulations
APP=platform-api
DOCKER_IMAGE=$(DOCKER_HOST)/$(DOCKER_NAMESPACE)/$(APP)
COMMIT=$(shell git rev-parse HEAD)
TAG=$(COMMIT)
ENV=production

all: platform-api account-api dispatch-service
.PHONY: all

deploy: push-platform-api push-account-api push-dispatch-service push-dispatch-api
.PHONY: deploy

build: 
	docker  build -f $(DOCKER_PATH) -t $(DOCKER_NAMESPACE)/$(APP):$(TAG) --build-arg app=$(APP) $(DOCKER_BUILD_CONTEXT)
.PHONY: build

push: build 
	docker push $(DOCKER_NAMESPACE)/$(APP):$(TAG)
.PHONY: push

platform-api:
					$(MAKE) build APP=platform-api TAG=$(TAG)
.PHONY: platform-api

account-api: 
			$(MAKE) build APP=account-api TAG=$(TAG)

.PHONY: account-api

dispatch-service:
			$(MAKE) build APP=dispatch-service TAG=$(TAG)
.PHONY: dispatch-service

dispatch-api:
			$(MAKE) build APP=dispatch-api TAG=$(TAG)
.PHONY: dispatch-api

push-platform-api:
					$(MAKE) push APP=platform-api TAG=$(TAG)
.PHONY: push-platform-api

push-account-api: 
			$(MAKE) push APP=account-api TAG=$(TAG)
.PHONY: push-account-api

push-dispatch-service:
			$(MAKE) push APP=dispatch-service TAG=$(TAG)
.PHONY: push-dispatch-service

push-dispatch-api:
			$(MAKE) push APP=dispatch-api TAG=$(TAG)
.PHONY: push-dispatch-api