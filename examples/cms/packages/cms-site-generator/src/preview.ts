import { join } from 'path';
import { S3 } from 'aws-sdk';
import { Context } from 'aws-lambda';
import { renderFile } from 'ejs';
const s3 = new S3();

//npx tsc && AWS_REGION=eu-central-1 catalogBucketName=cms-app-catalog-bucket webSiteBucketName=cms-app-preview-websites npx lambda-local -f build/index -e '{"input": {"id":"b1d7a4d0-11a0-11e9-a6ac-37ed6785dc37"}}'
export const handler = async (
  event: {
    input: {
      id: string;
      versionId: string;
      author: string;
      name: string;
    };
  },
  context: Context
) => {
  console.log({ event, context, env: process.env });

  const region = process.env.AWS_REGION;
  const webSiteBucketName = process.env.webSiteBucketName;
  const catalogBucketName = process.env.catalogBucketName;
  const data = { title: 'Blank', ...event.input };

  try {
    const articleData = (await s3
      .getObject({
        Bucket: catalogBucketName,
        Key: `articles/${data.id}.json`,
        VersionId: data.versionId,
      })
      .promise()).Body.toString();
    Object.assign(data, JSON.parse(articleData));
    Object.assign(data, { author: data.name });
  } catch (e) {
    console.error(e);
    return { result: null, failure: { message: e.message } };
  }

  try {
    const html = await renderFile(
      join(__dirname, 'article-preview-website-template.html'),
      data
    );

    await s3
      .putObject({
        Bucket: webSiteBucketName,
        Key: `${data.id}.html`,
        Body: html,
        ContentType: 'text/html',
        ACL: 'public-read',
        Metadata:
          {
            author: data.author,
          },
      })
      .promise();

    return {
      failure: null,
      result:
        {
          ...data,
          html,
          url:
            `https://s3-${region}.amazonaws.com/${webSiteBucketName}/${data.id}.html`,
        },
    };
  } catch (e) {
    console.error(e);
    return { result: null, failure: { message: e.message } };
  }
};
