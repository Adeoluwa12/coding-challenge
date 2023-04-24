const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');



const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "famHealth Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",


    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["../src/routers/*.js", "../src/app/*.js"],
};

const specs = swaggerJsdoc(options);



module.exports = specs;