#!/usr/bin/env bash

info() {
    msg="$1";

    tput bold;
    tput setaf "6"; # foreground cyan
    tput setab "7"; # background white
    echo "$msg";
    tput sgr0; # turn off all attributes
    tput el; # Fix background color trailing problem
}

success() {
    msg="$1";

    tput bold;
    tput setaf "2"; # foreground green
    tput setab "7"; # background white
    echo "$msg";
    tput sgr0;
    tput el;
}

warn() {
    msg="$1";

    tput bold;
    tput setaf "3"; # foreground yellow
    tput setab "7"; # background white
    echo "$msg";
    tput sgr0;
    tput el;
}

error() {
    msg="$1";

    tput bold;
    tput setaf "1"; # foreground cyan
    tput setab "7"; # background white
    echo "$msg";
    tput sgr0;
    tput el;
}

pushLineNonDup() {
    line="$1"
    file="$2"

    if [[ ! -f "$file" ]]; then
        echo "" >> "$file"
    fi

    # Append line to file
    if ! grep -Fxq "$line" "$file"; then
        echo "$line" >> "$file"
    fi
}
