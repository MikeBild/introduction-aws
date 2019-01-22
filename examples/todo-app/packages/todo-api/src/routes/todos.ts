import express from 'express';
import AthenaExpress from 'athena-express';
import aws, { S3 } from 'aws-sdk';
import { v1 } from 'uuid';
aws.config.update({ region: 'eu-central-1' });

const athena = new AthenaExpress({ aws });
const s3 = new S3();
const app = express.Router();

export default app;

app.get('/', async (_, res) => {
  try {
    const { Items: result } = await athena.query(
      'SELECT * FROM "todo-app"."todo_app_todos" order by done, name'
    );

    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post('/', async (req, res) => {
  const input = { ...req.body, id: v1() };

  try {
    await s3
      .putObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
        Body: JSON.stringify(input),
      })
      .promise();

    res.status(201).send({ result: input, failure: null });
  } catch (e) {
    res.status(500).send({ result: null, failure: { message: e.message } });
  }
});

app.delete('/:id', async (req, res) => {
  const input = { id: req.params.id };

  try {
    await s3
      .deleteObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
      })
      .promise();

    res.status(200).send({ result: input, failure: null });
  } catch (e) {
    res.status(500).send({ result: null, failure: { message: e.message } });
  }
});

app.put('/done', async (req, res) => {
  const input = { ...req.body };
  if (!input) return res.status(400).send({ result: null, failure: { message: `Missing request body.` } });
  if (!input.id) return res.status(400).send({ result: null, failure: { message: `Missing 'id' in request body.` } });

  try {
    const existingObject = await s3.getObject({
      Bucket: 'todo-app-todos',
      Key: `${input.id}.json`,
    }).promise()

    const existingObjectContent = JSON.parse(((existingObject || {}).Body || {}).toString())

    existingObjectContent.done = !existingObjectContent.done

    await s3
      .putObject({
        Bucket: 'todo-app-todos',
        Key: `${input.id}.json`,
        Body: JSON.stringify(existingObjectContent),
      })
      .promise();

    res.status(200).send({ result: existingObjectContent, failure: null });
  } catch (e) {
    res.status(500).send({ result: null, failure: { message: e.message } });
  }
});
