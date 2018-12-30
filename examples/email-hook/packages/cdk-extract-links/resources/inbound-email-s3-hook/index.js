const AWS = require("aws-sdk");
const { simpleParser } = require("mailparser");
const cheerio = require("cheerio");
const uuidv1 = require("uuid/v1");
const hash = require("hash.js");
const extractLinks = require("./extract-links.js");
const s3 = new AWS.S3();
const sns = new AWS.SNS();

exports.main = async function(event, context) {
  console.log({ event, context });

  await Promise.all(
    event.Records.map(async record => {
      const bucket = record.s3.bucket.name;
      const key = record.s3.object.key;
      const object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
      const email = object.Body.toString("utf-8");

      let parsed = await simpleParser(email);
      const $ = cheerio.load(parsed.textAsHtml);

      const regex = /https:\/\/www\.immobilienscout24\.de\/expose\/\d+/;
      const urls = new Set();
      $("a[href^='https://www.immobilienscout24.de/expose/']").each(
        (_, element) => {
          const url = element.attribs.href.match(regex);
          urls.add(url[0]);
        }
      );

      console.log({ urls });

      await Promise.all(
        [...urls].map(async url => {
          const data = { url };
          const digest = hash
            .sha256()
            .update(JSON.stringify(data))
            .digest("hex");

          const payload = {
            uuid: uuidv1(),
            name: "NewUrl",
            version: 1,
            data,
            digest,
            sourceEvent: { id: email.messageId, name: "InboundEmail" }
          };
          console.log({ payload });

          const result = await sns
            .publish({
              Message: JSON.stringify({ default: JSON.stringify(payload) }),
              MessageStructure: "json",
              TargetArn: process.env.SNS_TARGET_ARN
            })
            .promise();

          console.log({ result });
        })
      );
    })
  );
};
