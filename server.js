const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();
var api = require('./api.js');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
client.connect();

const path = require('path');
const PORT = process.env.PORT || 5000;

app.set('port', PORT);

app.use(cors());
app.use(bodyParser.json());


app.use((req, res, next) => 
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	);
	next();
});

app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
});

api.setApp( app, client );

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}
