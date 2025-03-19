docker build -f Dockerfile.node20 -t pjameweb .

docker stop pjameweb
docker rm pjameweb
docker run -dp 3101:3000 pjameweb .