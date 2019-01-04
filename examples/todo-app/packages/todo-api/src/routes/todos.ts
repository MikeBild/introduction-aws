import express from 'express';

const app = express.Router();

export default app;

const todos = [
  { id: 1, description: 'todo1', done: false },
  { id: 2, description: 'todo2', done: true },
];

app.get('/', (req, res) => {
  res.send(todos);
});

app.post('/', (req, res) => {
  const input = { ...req.body, id: todos.length };

  todos.push(input);

  res.send(input);
});
