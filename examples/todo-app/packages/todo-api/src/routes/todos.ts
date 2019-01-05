import express from 'express';
import AthenaExpress from 'athena-express';
import aws from 'aws-sdk';
aws.config.update({ region: 'eu-central-1' });
const athena = new AthenaExpress({ aws });

const app = express.Router();

export default app;

const todos = [
  { id: 1, description: 'todo1', done: false },
  { id: 2, description: 'todo2', done: true },
];

app.get('/', async (req, res) => {
  const { Items: result } = await athena.query(
    'SELECT * FROM "todo-app"."todo_app_todos"'
  );

  res.send(result);
});

app.post('/', (req, res) => {
  const input = { ...req.body, id: todos.length };

  todos.push(input);

  res.send(input);
});
