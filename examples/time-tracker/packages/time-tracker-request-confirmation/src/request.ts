import { StepFunctions } from 'aws-sdk';
const stepFunctions = new StepFunctions({ region: 'eu-central-1' });

module.exports.handler = async (event, context) => {
  console.log({ event, context });
  try {
    const result = await executeConfirmationStateMachine(stepFunctions, event);

    return {
      success: { ...result, id: result.executionArn },
      failure: null,
    };
  } catch (e) {
    return { success: null, failure: { message: e.message } };
  }
};

async function executeConfirmationStateMachine(
  stepFunctions: StepFunctions,
  input: any
): Promise<any> {
  const waiter = new Promise((resolve, reject) => {
    stepFunctions.getActivityTask(
      {
        activityArn:
          'arn:aws:states:eu-central-1:044086961882:activity:WaitForConfirmation',
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });

  const stateMachine = stepFunctions
    .startExecution({
      stateMachineArn:
        'arn:aws:states:eu-central-1:044086961882:stateMachine:Time-Tracker-Release-Confirmation',
      input: JSON.stringify(input),
    })
    .promise();

  const [
    waiterResult,
    stateMachineResult,
  ] = await Promise.all([
    waiter,
    stateMachine,
  ]);

  return { ...waiterResult, ...stateMachineResult };
}
