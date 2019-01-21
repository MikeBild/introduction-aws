import express from 'express';
import AthenaExpress from 'athena-express';
import aws, { S3 } from 'aws-sdk';
import { v1 } from 'uuid';
aws.config.update({ region: 'eu-central-1' });

const athena = new AthenaExpress({ aws });
const s3 = new S3();
const app = express.Router();

export default app;

app.get('/', async (req, res) => {
  try {
    const { Items: result } = await athena.query(
      'SELECT * FROM "todo-app"."todo_app_todos"'
    );

    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post('/', async (req, res) => {
  const input = { ...req.body.input, id: v1() };

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
