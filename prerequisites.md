# Prerequisites

* [AWS-CLI](#aws-cli)
* [NodeJS](#nodejs)
* [AWS-CDK Toolkit](#cdk)
* [IDE for JavaScript/TypeScript](#ide)
* [AWS Account and User](#aws-account-and-user)
* [AWS-SDK Toolkit](#sdk)

Ensure access to:

* [https://npmjs.com/](https://npmjs.com/)
* [https://github.com/](https://github.com/)

Nice to have:

* [NVM](https://github.com/creationix/nvm)
* [Git](https://git-scm.com/) / [GitHub Desktop](https://desktop.github.com/)
* [GitHub Account](https://github.com/)
* [Cygwin](https://www.cygwin.com/) (Unix tools for Windows)

## AWS-CLI

* OSX `brew install awscli`
* Windows [MSI](https://s3.amazonaws.com/aws-cli/AWSCLI64PY3.msi)
* Linux/Unix `pip install awscli`

## NodeJS

* OSX `brew install node`
* Windows [https://nodejs.org](https://nodejs.org)
* Linux [https://nodejs.org](https://nodejs.org)

## CDK

Open a terminal session and run the following command:

* Windows: you’ll need to run this as an Administrator
* POSIX: on some systems you may need to run this with sudo

```bash
npm install -g aws-cdk
cdk --version
```

This Hands-On was tested using **v0.21.0** of the AWS-CDK.

## IDE

* [Visual Studia Code](https://code.visualstudio.com/)
* [Sublime Text](https://www.sublimetext.com)

## AWS Account and User

Using the AWS-CLI: `aws configure`

## SDK

Open a terminal session in your project folder and run the following command:

`npm install aws-sdk`

Create a `credentials` file:

* OSX/Linux `~/.aws/credentials`
* Windows  `C:\Users\USERNAME\.aws\credentials``

```ini
[default]
aws_access_key_id=your_access_key
aws_secret_access_key=your_secret_key
```