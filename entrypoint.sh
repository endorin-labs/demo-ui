#!/bin/bash
ip addr add 127.0.0.1/32 dev lo
ip link set dev lo up


touch /app/libnsm.so
# set up vsock for the UI (port 3000)

socat vsock-listen:3000,fork,reuseaddr tcp-connect:localhost:3000 &

# start ollama in background
ollama serve &

# wait for ollama to start
sleep 5

# start the chatbot ui with bun (much faster!)
cd /app/
bun i
bun start
