const axios = require('axios');
const bcrypt = require('bcryptjs');

const { authenticate } = require('./middlewares');

const db = require('../database/dbConfig.js');

module.exports = server => {
  server.get('/', serverRunning);
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function serverRunning(req, res) {
    res.send('Server is ON');
}

function register(req, res) {
    // implement user registration
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 6);
    credentials.password = hash;
    db('users').insert(credentials)
               .then(ids => {
                    res.status(201).json(ids);
                })
               .catch(err => res.send(err));
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
