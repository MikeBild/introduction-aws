module.exports = {
  typeDefs: `
  scalar AWSDateTime
  directive @aws_auth(cognito_groups: [String] = []) on FIELD_DEFINITION
  `,
};
