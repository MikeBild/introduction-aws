import { StepFunctions } from 'aws-sdk';
const stepFunctions = new StepFunctions({ region: 'eu-central-1' });

module.exports.handler = async (event, context) => {
  console.log({ event, context });
  try {
    stepFunctions
      .sendTaskFailure({
        taskToken: event.taskToken,
      })
      .promise()
      .then((data) => {
        console.log('TaskSuccess');
        console.log({ data });
      })
      .catch((e) => {
        console.error(e);
      });
    return {
      success: event.taskToken,
      failure: null,
    };
  } catch (e) {
    return { success: null, failure: { message: e.message } };
  }
};
