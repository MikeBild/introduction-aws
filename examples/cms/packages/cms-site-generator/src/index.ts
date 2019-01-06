import { join } from 'path';
import { S3 } from 'aws-sdk';
import { Context } from 'aws-lambda';
import { renderFile } from 'ejs';
const s3 = new S3();

//npx tsc && AWS_REGION=eu-central-1 bucketName=cms-app-websites npx lambda-local -f build/index -e '{"id":"123", "content": "Hello World", "name":"mike"}'
export const handler = async (event: any, context: Context) => {
  console.log({ event, context, env: process.env });

  const region = process.env.AWS_REGION;
  const bucketName = process.env.bucketName;
  const data = { title: 'Blank', ...event };
  const html = await renderFile(
    join(__dirname, 'article-site-template.html'),
    data
  );

  await s3
    .putObject({
      Bucket: bucketName,
      Key: `${event.id}.html`,
      Body: html,
      ContentType: 'text/html',
      ACL: 'public-read',
      Metadata:
        {
          author: event.name,
        },
    })
    .promise();

  return {
    html,
    url: `https://s3-${region}.amazonaws.com/${bucketName}/${event.id}.html`,
  };
};
