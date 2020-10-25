#!/bin/bash

docker run --gpus all -it --rm -v $PWD/tf:/tf -p 8888:8888 tensorflow/tensorflow:2.3.1-gpu-jupyter
