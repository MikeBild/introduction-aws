import { S3 } from 'aws-sdk';
import { Context } from 'aws-lambda';
const s3 = new S3();

//npx tsc && AWS_REGION=eu-central-1 bucketName=cms-app-preview-websites npx lambda-local -f build/previews -h get -e '{"id":"66468140-1249-11e9-8ea6-3d38037c854f", "versionId": "yTwXiu5rGPZYYE9BrDh_K9I51zs5DySj"}'
export const get = async (
  event: { id: string; versionId: string },
  context: Context
) => {
  console.log({ event, context, env: process.env });
  const region = process.env.AWS_REGION;
  const bucketName = process.env.bucketName;

  try {
    const result = await s3
      .getObject({
        Bucket: bucketName,
        Key: `${event.id}-${event.versionId}.html`,
      })
      .promise();

    return {
      ...event,
      html: result.Body.toString(),
      ...result.Metadata,
      url:
        `https://s3-${region}.amazonaws.com/${bucketName}/${event.id}-${event.versionId}.html`,
    };
  } catch (e) {
    return null;
  }
};
