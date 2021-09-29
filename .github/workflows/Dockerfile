FROM ubuntu:latest
ARG CLOUDFLARE_TOKEN
ARG CLOUDFLARE_ZONE_ID

# Get the TLS CA certificates, they're not provided by busybox.
RUN apt-get update && apt-get install -y ca-certificates \
  curl \
  bash \
  jq

COPY entrypoint.sh /entrypoint.sh 

# Code file to execute when the docker container starts up (`entrypoint.sh`)
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]

# Variables

ENV CLOUDFLARE_TOKEN=${CLOUDFLARE_TOKEN}
ENV CLOUDFLARE_ZONE_ID=${CLOUDFLARE_ZONE_ID}


