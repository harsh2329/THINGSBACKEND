// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const port = 1000;

// // Load swagger document (make sure the path is correct)
// // const swaggerDocument = YAML.load('./swagger.yaml');

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors()); // Enable CORS for your React app

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/THINGSSWAGGER')
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// // Swagger documentation
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Basic route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });



// const deviceRoutes = require('./Routes/deviceRoutes');
// app.use('/device', deviceRoutes);

// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   });
// });


// app.listen(port, () => {
//   console.log('Server Started at http://localhost:${port}');
// });

// module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 1000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



mongoose.connect('mongodb+srv://10soniharsh12:<10soniharsh12>@cluster0.aaolrtn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('🎉 Connected to MongoDB');

  const deviceRoutes = require('./Routes/deviceRoutes');
  const CustomerRoutes = require('./Routes/CustomerRoutes');

  app.use('/device', deviceRoutes);
  app.use('/customers', CustomerRoutes);
  app.get('/', (req, res) => res.send('Hello World!'));
  app.get('/health', (req, res) => res.json({ success: true, timestamp: new Date() }));

  app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
