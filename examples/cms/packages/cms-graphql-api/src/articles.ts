import { S3 } from 'aws-sdk';
import { Context } from 'aws-lambda';
import { v1 } from 'uuid';
const s3 = new S3();

interface Filter {
  isLatest?: boolean;
}

interface Event {
  filter?: Filter;
}

//npx tsc && bucketName=cms-app-catalog-bucket npx lambda-local -f build/articles -h list -e '{ "filter": { "isLatest": false } }'
export const list = async ({ filter = {} }: Event = {}, context: Context) => {
  console.log({
    filter,
    context,
    env: process.env,
  });

  const documentList = await s3
    .listObjectVersions({
      Bucket: process.env.bucketName,
      Prefix: 'articles',
    })
    .promise();

  const filterDeletedObjects = (x) =>
    !documentList.DeleteMarkers.find((y) => y.Key === x.Key);

  return documentList.Versions
    .filter(filterDeletedObjects)
    .map((document) => ({
      id: document.Key.replace('articles/', '').replace('.json', ''),
      versionId: document.VersionId,
      modifiedAt: document.LastModified,
      isLatest: document.IsLatest,
    }))
    .filter((x) => (filter.isLatest === false ? true : x.isLatest));
};

//npx tsc && bucketName=cms-app-catalog-bucket npx lambda-local -f build/articles -h get -e '{"id":"...", "versionId": null}'
export const get = async (
  event: { id: string; versionId: string },
  context: Context
) => {
  console.log({ event, context, env: process.env });
  const result = await s3
    .getObject({
      VersionId: event.versionId,
      Bucket: process.env.bucketName,
      Key: `articles/${event.id}.json`,
    })
    .promise();

  return { ...JSON.parse(result.Body.toString()), versionId: result.VersionId };
};

//npx tsc && bucketName=cms-app-catalog-bucket npx lambda-local -f build/articles -h add -e '{"input": {"authorId":"a", "content":"a"}}'
export const add = async (
  event: { input: { id?: string; authorId: string; content: string } },
  context: Context
) => {
  console.log({ event, context, env: process.env });
  try {
    event.input.id = v1();
    await s3
      .putObject({
        Bucket: process.env.bucketName,
        Key: `articles/${event.input.id}.json`,
        Body: JSON.stringify(event.input),
      })
      .promise();
    return { result: event.input, failure: null };
  } catch (e) {
    return { result: null, failure: { message: e.message } };
  }
};

//npx tsc && bucketName=cms-app-catalog-bucket npx lambda-local -f build/articles -h update -e '{"input": {"id":"...", "authorId":"b", "content":"b"}}'
export const update = async (
  event: { input: { id: string; authorId: string; content: string } },
  context: Context
) => {
  console.log({ event, context, env: process.env });
  try {
    await s3
      .putObject({
        Bucket: process.env.bucketName,
        Key: `articles/${event.input.id}.json`,
        Body: JSON.stringify(event.input),
      })
      .promise();
    return { result: event.input, failure: null };
  } catch (e) {
    return { result: null, failure: { message: e.message } };
  }
};

export const remove = async (event: any, context: Context) => {
  console.log({ event, context, env: process.env });
  return { result: null, failure: null };
};
