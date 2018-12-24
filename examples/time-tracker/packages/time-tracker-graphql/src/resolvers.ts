import { S3 } from 'aws-sdk';

export default {
  Me:
    {
      async summary({ id }: { id: string }, _: never, { s3 }: { s3: S3 }) {
        const { Body } = await s3
          .getObject({
            Bucket: 'time-tracker-reports',
            Key: 'summary.json',
          })
          .promise();

        const summaryReport = JSON.parse(Body.toString());

        const [
          first,
        ] = Object.keys(summaryReport).filter((x) => x === id).map((x) => ({
          ...summaryReport[x],
          id: x,
        }));
        return first;
      },
    },
  Query:
    {
      async summary(_: never, __: never, { s3 }: { s3: S3 }) {
        const { Body } = await s3
          .getObject({
            Bucket: 'time-tracker-reports',
            Key: 'summary.json',
          })
          .promise();
        const summaryReport = JSON.parse(Body.toString());

        return Object.keys(summaryReport).map((x) => ({
          ...summaryReport[x],
          id: x,
        }));
      },
      async me(_: never, { name }: { name: string }) {
        return { id: name };
      },
    },
  Mutation:
    {
      async requestForRelease(
        _: never,
        { input }: { input: any },
        { s3 }: { s3: S3 }
      ) {
        console.log({ input });
      },
      async recordHours(
        _: never,
        { input }: { input: any },
        { s3 }: { s3: S3 }
      ) {
        const request = { ...input, id: Date.now(), date: new Date() };
        try {
          await s3
            .putObject({
              Bucket: 'time-tracker-requests',
              Key: `${request.name}/${request.id}`,
              Body: JSON.stringify(request, null, 2),
            })
            .promise();

          return { success: request, failure: null };
        } catch (e) {
          return { success: null, failure: { message: e.message } };
        }
      },
    },
};
