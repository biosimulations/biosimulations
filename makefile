DOCKER_BUILD_CONTEXT=.
DOCKER_BACKEND_PATH=./deploy/docker/backend.dockerfile
DOCKER_FRONTEND_PATH=./deploy/docker/frontend.dockerfile
DOCKER_REGISTRY=docker.io
DOCKER_USER=crbm
APP=biosimulations-api
DOCKER_IMAGE=$(DOCKER_HOST)/$(DOCKER_USER)/$(APP)
COMMIT=$(shell git rev-parse HEAD)
TAG=$(COMMIT)
ENV=production

all: biosimulations-api account-api
.PHONY: all

build: 
	docker  build -f $(DOCKER_BACKEND_PATH) -t crbm/$(APP):$(TAG) --build-arg app=$(APP) $(DOCKER_BUILD_CONTEXT)
.PHONY: build

push: build 
	docker push crbm/$(APP):$(TAG)
.PHONY: push

deploy:
	kubectl apply -f deploy/kubernetes/production
.PHONY: deploy

biosimulations-api:
					$(MAKE) push APP=biosimulations-api TAG=$(TAG)
.PHONY: biosimulations-api

account-api: 
			$(MAKE) push APP=account-api TAG=$(TAG)

.PHONY: account-api

biosimulations-dispatch-service:
			$(MAKE) push APP=biosimulations-dispatch-service TAG=$(TAG)


