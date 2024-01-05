## Prescriptions API repository 

 This is a REST API for prescriptions repository. It's built with NestJs and using Mongoose.

## Prerequisites
Please make sure that Node.js (version >= 16) is installed on your operating system.

- [NodeJS](https://nodejs.org/en/) `>= 16`
- [NestJs](https://nestjs.com/)
- [mongoose](https://www.npmjs.com/package/mongoose)`>= 9.0.3`


## Recommended IDE

[Vscode](https://code.visualstudio.com/) is recommended as the debug configuration is provided assuming vscode.


## Description

[Github](https://github.com/Neeraj3045/fhir-app) Patient Prescriptions repository based on NHI

## Getting Started

Clone the repository:

```
git clone https://github.com/Neeraj3045/fhir-app
cd repository
```

## Installation all required package used in package.json

```bash
$ npm install
```

Copy the `.env.example` file to `.env` and fill in the details in .env:

```
cp .env.example .env
```

## Running the app

```bash
$ npm run start
```
The server will start on port 1001. You can change this by setting the `PORT` environment variable in the `.env` file.

## Test

```bash
# unit tests
$ npm run test
```


## API Endpoints Information

- `http://localhost:1001`: Base Url
- `GET  api-docs/`: Swagger documentation
- `GET  api/v1/prescriptions/:nhi`: Search prescription by NHI
- `POST api/v1/prescriptions`: Add a new prescription
- `PUT  api/v1/prescriptions/:nhi/:id`: Update an existing prescription

## Support us


Contact to prescriptions NHI at support@gmail.com.


