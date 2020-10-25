#!/bin/bash

docker build -t flask_server .
docker run --gpus all --rm -p 12387:80 --name instance flask_server
