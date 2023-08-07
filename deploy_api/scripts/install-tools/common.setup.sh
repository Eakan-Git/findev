#!/usr/bin/env bash

info() {
    tput bold;tput setaf "6";tput setab "7";echo "$1";tput sgr0;tput el;
}

info "Installing curl, wget, jq, gpg, build-essential..."

sudo apt-get update && sudo apt-get install -y curl wget jq gpg build-essential
