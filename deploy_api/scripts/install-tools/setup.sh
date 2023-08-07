#!/usr/bin/env bash

curr_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$curr_dir"

. ../utils/functions.sh

# Install tools
find * -name "*.sh" -not -path "setup.sh" | while read setup; do
    # NOTE: We cd back to make sure the directory is correct
    cd "$curr_dir"

    info "Running $setup..."

    . ./$setup
done
