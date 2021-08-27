# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.192.0/containers/javascript-node/.devcontainer/base.Dockerfile

ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends python3

RUN su node -c "git config --global pull.rebase true"

RUN su node -c "npm install -g @nrwl/cli commitizen"
