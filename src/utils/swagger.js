const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const version = require('../package.json')



const swaggerOptions = {
     swaggerDefinition: {
       info: {
         title: 'REST API Docs',
         version: '1.0.0',
         description: 'Telemedicine App'
       },
       basePath: '/'
     },
     apis: ["./src/app.js/*.js", "./src/models/*.js"],
   };


   const swaggerSpec = swaggerJsdoc(swaggerOptions)