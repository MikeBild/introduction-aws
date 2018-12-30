import { gql } from 'apollo-server';

export default gql`
  scalar JSON

  type Summary {
    id: ID
    count: Int
    hours: Float
  }

  type Me {
    "My summary"
    summary: Summary
  }

  type Query {
    "Summary Report"
    summary: [Summary]
    "My Queries"
    me(name: ID): Me
  }

  type ReleaseResult {
    failure: ReleaseFailure
    success: Release
  }

  type Release {
    id: ID
    taskToken: ID
    executionArn: ID
    startDate: String
  }

  type ReleaseFailure {
    message: String
  }

  input ReleaseInput {
    id: ID
    name: String
    hours: Float
  }

  type HoursResult {
    failure: HoursFailure
    success: Hours
  }

  type Hours {
    id: ID
    name: String
    hours: Float
    date: String
  }

  type HoursFailure {
    message: String
  }

  input HoursInput {
    name: String
    hours: Float
    date: Date
  }

  type Mutation {
    requestForRelease(input: ReleaseInput!): ReleaseResult
    recordHours(input: HoursInput!): HoursResult
  }
`;
