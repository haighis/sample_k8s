docker build -t samplefrontend .
docker run -it -p  3000:3000 samplefrontend
curl --location --request GET 'http://localhost:4000'