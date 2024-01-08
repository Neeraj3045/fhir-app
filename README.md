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
## Flow Diagram
![alt text](/public/Fhir-Architecture.drawio.png)

## API Endpoints Information

- `http://localhost:1001`: Base Url
- `GET  api-docs/`: Swagger documentation
- `GET  /api/v1/prescriptions/:nhi`: Search prescription by NHI
- `POST /api/v1/prescriptions`: Add a new prescription
- `PUT  /api/v1/prescriptions/:nhi/:id`: Update an existing prescription

## Development Approach

Develop an API for prescription management involves several steps, from setting up the project to handling Create,update & search operations and integrating third-party APIs using NestJS & Mongodb with.

1. Setup the NestJs with all required dependency & create project 
2. Configure data base module for mongodb
3. Create prescription module,controller and service
4. Create prescripton Schema & DTO 
5. Create prescription service method createPrescripton,updatepresciptions & searchPrescriptons
6. Implement prescription API end point in prescripton controller
   - `POST /api/v1/prescriptions` --- Create prescriptions
   - `GET  /api/v1/prescriptions/:nhi` ---- Search prescriptions
   - `PUT /api/v1/prescriptions/:nhi/:prescriptionId` --- Update prescriptions 
7. Handle third party API call accordingly at every steps Create,update & search NHI
   -  `Use Axios to call the third-party API`
   -  `Return the data from the third-party API to the controller`
8. Write cron schedule for sync data from internal & external API
9. Error handling - Error handling Global & local exception filter,HTTP appropriate status code
10. Testing - Write unit test for service method using Jest
11. Documentation : Use swagger documentation for API end point,model & details response 
12. Deployement : Prepare for deployemnt configration & env file


## Support us


Contact to prescriptions NHI at support@gmail.com.


