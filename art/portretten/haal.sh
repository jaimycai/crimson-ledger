#!/bin/sh
# haal.sh <index> <url> … — downloads finished portraits into ruw/<index>.png and notes the URL
cd "$(dirname "$0")"; mkdir -p ruw
while [ $# -ge 2 ]; do curl -sS -o "ruw/$1.png" "$2" && echo "$1 $2" >> urls.txt; shift 2; done
ls ruw | wc -l
