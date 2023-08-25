// port 3001
const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3001;

const users = [
  {"firstName":"Carl","lastName":"Sample","email":"carls@gmail.com"},
  {"firstName":"Joe","lastName":"Sample","email":"joes@gmail.com"}
];

app.use(bodyParser.json());
//app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-example/"));

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  console.log('post user ', req)
  const user = req.body.user;
  users.push(user);
  res.json("user addedd");
});

// app.get('/', (req,res) => {
//   res.sendFile(process.cwd()+"/my-app/dist/angular-nodejs-example/index.html")
// });

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
