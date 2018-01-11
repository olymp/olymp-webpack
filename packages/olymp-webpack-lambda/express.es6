const express = require('express');
const apiGatewayLocal = require('api-gateway-localdev');

const { playground, server } = require('__resourceQuery');

export default apiGatewayLocal(express(), [
  {
    lambda: server,
    method: 'POST',
    path: '/graphql',
    responses: {
      '200': {
        responseTemplates: {},
        responseModels: {}
      },
      '404': {
        selectionPattern: '.*404.*',
        responseTemplates: {},
        responseModels: {}
      }
    },
    requestTemplates: {}
  },
  {
    lambda: playground,
    method: 'GET',
    path: '/graphql',
    responses: {
      '200': {
        responseTemplates: {},
        responseModels: {}
      },
      '404': {
        selectionPattern: '.*404.*',
        responseTemplates: {},
        responseModels: {}
      }
    },
    requestTemplates: {}
  }
]);
