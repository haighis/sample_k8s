docker build -t samplebackend .
docker run -it -p  3000:3000 samplebackend
curl --location --request GET 'http://localhost:3000/api/users'