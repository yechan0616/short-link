#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  REGISTRY=ghcr.io IMAGE_NAME=OWNER/short-link SSH_HOST=host SSH_USER=user \
#  SSH_KEY=~/.ssh/id_rsa APP_DIR=/srv/short-link ./scripts/deploy.sh

REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_NAME="${IMAGE_NAME:-${GITHUB_REPOSITORY:-}}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
SSH_HOST="${SSH_HOST:?set SSH_HOST}"
SSH_USER="${SSH_USER:?set SSH_USER}"
SSH_PORT="${SSH_PORT:-22}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_rsa}"
APP_DIR="${APP_DIR:-/srv/short-link}"

if [[ -z "$IMAGE_NAME" ]]; then
  echo "IMAGE_NAME is empty. Set IMAGE_NAME (e.g., owner/short-link)." >&2
  exit 1
fi

IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building and pushing image: ${IMAGE}"
docker build -t "${IMAGE}" .
echo "Pushing ${IMAGE}"
docker push "${IMAGE}"

echo "Deploying to ${SSH_USER}@${SSH_HOST}:${SSH_PORT} at ${APP_DIR}"
ssh -i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no \
  "${SSH_USER}@${SSH_HOST}" bash -se <<EOF
set -e
mkdir -p "$APP_DIR"
cd "$APP_DIR"
if [ ! -d .git ]; then
  git clone --depth 1 https://github.com/${IMAGE_NAME%/*}/short-link . || true
fi
echo IMAGE=${IMAGE} > .env
docker compose pull || true
docker compose up -d --remove-orphans
EOF

echo "Done."
