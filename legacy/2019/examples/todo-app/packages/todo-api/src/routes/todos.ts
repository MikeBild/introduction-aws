import express from 'express';
import AthenaExpress from 'athena-express';
import aws, { S3 } from 'aws-sdk';
import { v1 } from 'uuid';

const athena = new AthenaExpress({ aws });
const s3 = new S3();
const app = express.Router();

export default app;

app.get('/', async (req, res, next) => {
  try {
    const username = req.user.username;
    const done = req.query.done && JSON.parse(req.query.done);
    const description = req.query.description;

    const query = `SELECT * FROM "todo-app"."todo_app_todos"
    WHERE username='${username}'
    ${done ? `AND done=${done}` : ''}
    ${description ? `AND description='${description}'` : ''}
    ORDER BY createdAt`;

    const { Items: result } = await athena.query(query);

    res.send(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.post('/', async (req, res, next) => {
  const username = req.user.username;
  const input = {
    ...req.body,
    id: v1(),
    createdAt: Date.now(),
    done: false,
    username,
  };

  try {
    await s3
      .putObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
        Body: JSON.stringify(input),
      })
      .promise();

    res.status(201).send(input);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.delete('/:id', async (req, res, next) => {
  const input = { id: req.params.id };

  try {
    await s3
      .deleteObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
      })
      .promise();

    res.send(input);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.put('/done', async (req, res, next) => {
  const input = { ...req.body, modifiedAt: Date.now() };
  if (!input) return next(new Error('Missing request body'));
  if (!input.id) return next(new Error(`Missing 'id' in request body.`));

  try {
    const existingObject = await s3
      .getObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
      })
      .promise();

    const existingObjectContent = JSON.parse(
      ((existingObject || {}).Body || {}).toString()
    );

    existingObjectContent.done = !existingObjectContent.done;

    await s3
      .putObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
        Body: JSON.stringify(existingObjectContent),
      })
      .promise();

    res.send(existingObjectContent);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
