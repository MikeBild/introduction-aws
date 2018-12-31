const AWS = require("aws-sdk");
const cfnCR = require("cfn-custom-resource");
const { configure, sendSuccess, sendFailure, LOG_VERBOSE } = cfnCR;

configure({ logLevel: LOG_VERBOSE });

exports.main = async function(event, context) {
  try {
    const ses = new AWS.SES();
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    let ref;

    if (event.RequestType == "Delete") {
      const activeRuleSet = await ses
        .describeActiveReceiptRuleSet({})
        .promise();

      console.log({ activeRuleSet });
      if (activeRuleSet.Metadata.Name == event.ResourceProperties.RuleSetRef) {
        ref = null;
      } else {
        ref = activeRuleSet.Metadata.Name;
      }
    } else {
      ref = event.ResourceProperties.RuleSetRef;
    }

    console.log({ ref });
    const params = { RuleSetName: ref };
    console.log({ params });

    const apiCall = await ses.setActiveReceiptRuleSet(params).promise();
    console.log({ apiCall });
    const result = await sendSuccess(
      event.ResourceProperties.RuleSetRef,
      {},
      event
    );
    console.log({ result });
    return result;
  } catch (e) {
    console.log("caught error", e);
    await sendFailure("mistakes were made", event);
  }
};
