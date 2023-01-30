const mongoose = require('mongoose');

const getConnectionToMongoDB = () => {
  const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.MONGO_URL, connectionParams);

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDb successfully');
  });

  mongoose.connection.on('error', (error) => {
    console.log('Error while connecting to database:' + error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDb connection disconnected');
  });
};

module.exports = getConnectionToMongoDB;
