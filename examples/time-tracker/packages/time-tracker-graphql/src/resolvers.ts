import { S3, Lambda } from 'aws-sdk';

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
      async recordHours(
        _: never,
        { input }: { input: any },
        { s3 }: { s3: S3 }
      ) {
        const request = { date: new Date(), ...input, id: Date.now() };
        try {
          await s3
            .putObject({
              Bucket: 'time-tracker-requests',
              Key: `${request.name}/${request.id}.json`,
              Body: JSON.stringify(request),
            })
            .promise();

          return { success: request, failure: null };
        } catch (e) {
          return { success: null, failure: { message: e.message } };
        }
      },
      async requestForRelease(
        _: never,
        { input }: { input: any },
        { lambda }: { lambda: Lambda }
      ) {
        const { Payload } = await lambda
          .invoke({
            FunctionName: 'time-tracker-request',
            Payload: JSON.stringify({ input }),
          })
          .promise();

        return JSON.parse(Payload.toString());
      },
    },
};
