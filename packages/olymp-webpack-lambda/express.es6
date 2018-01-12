const express = require('express');

const { playground, server } = require('__resourceQuery');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const invoke = func => (req, res) => {
  func(
    {
      httpMethod: req.method,
      queryStringParameters: req.query || {},
      body: req.body || {},
      headers: req.headers || {}
    },
    {},
    (err, { statusCode, headers, body }) => {
      res
        .status(statusCode)
        .set(headers)
        .send(body);
    }
  );
};
app.get('/graphql', invoke(playground));
app.post('/graphql', invoke(server));

export default app;
