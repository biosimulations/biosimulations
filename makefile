APP=biosimulations-api
TAG=dev
ENV=production

all: biosimulations-api account-api
.PHONY: all

build: 
	docker  build -f ./deploy/docker/backend.dockerfile -t crbm/$(APP):$(TAG) --build-arg app=$(APP) .
.PHONY: build

push: build 
	docker push crbm/$(APP):$(TAG)
.PHONY: push

deploy:
	kubectl apply -f deploy/kubernetes/production
.PHONY: deploy

biosimulations-api:
					$(MAKE) push APP=biosimulations-api
.PHONY: biosimulations-api

account-api: 
			$(MAKE) push APP=account-api
.PHONY: account-api


