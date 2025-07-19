const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const mongoose = require('mongoose');
const app = express();
const port = 1000;

mongoose.connect('mongodb://localhost:27017/THINGSSWAGGER').then(() => {
  console.log('Connected to MongoDB');
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const deviceRoutes = require('/deviceRoutes');
// const customerRoutes = require('./Routes/customerRoutes'); // If you have customer routes


app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
