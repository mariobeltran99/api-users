const express = require('express');
var cors = require('cors')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const app = express();
const port = 8080;

app.use(cors());

app.use((request, response, next) => {
  response.contentType('application/json');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/users/', (req, res) => {
  res.send(
    JSON.parse(localStorage.getItem('users')).sort((a, b) => {
      return a.id - b.id;
    }),
  );
});

app.post('/users/', (req, res) => {
  const storedUsers = JSON.parse(localStorage.getItem('users'));
  let id = JSON.parse(localStorage.getItem('id'));
  id++;
  const newUser = { id, ...req.body };
  storedUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(storedUsers));
  localStorage.setItem('id', JSON.stringify(id));
  res.send(newUser);
});

app.get('/users/:id', (req, res) => {
  const storedUsers = JSON.parse(localStorage.getItem('users'));
  const userId = +req.params.id;
  const user = storedUsers.filter((user) => user.id === userId);
  res.send(user[0]);
});

app.put('/users/:id', (req, res) => {
  const storedUsers = JSON.parse(localStorage.getItem('users'));
  const userId = +req.params.id;
  const newStoredUsers = storedUsers.filter((user) => user.id !== userId);
  const newUser = { id: userId, ...req.body };
  newStoredUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(newStoredUsers));
  res.send(newUser);
});

app.delete('/users/:id', (req, res) => {
  const storedUsers = JSON.parse(localStorage.getItem('users'));
  const userId = +req.params.id;
  const newStoredUsers = storedUsers.filter((user) => user.id !== userId);
  localStorage.setItem('users', JSON.stringify(newStoredUsers));
  res.status(204).send({});
});

app.listen(port, () => {
  localStorage.setItem('id', 0);
  localStorage.setItem('users', JSON.stringify([]));
  console.log(`App listening on port ${port}`);
});
