//require('./dotenv').config();

const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { authenticate } = require('./middlewares');

//NEED jwtKey AS DEFINED IN AUTHENTICATE MIDDLEWARE WHILE GENERATING TOKEN..
const jwtKey = require('../_secrets/keys').jwtKey;

const db = require('../database/dbConfig.js');

module.exports = server => {
  server.get('/', serverRunning);
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

//======= FUNCTION TO SEE SERVER RUNNING ON BASIC ROUTE '/' ========
function serverRunning(req, res) {
    res.send('Server is ON');
}

//======= FUNCTION TO SEE REGISTER NEW USERE '/api/register' ========
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

//======= FOR LOGIN NEED GENERATE-TOKEN FUNCTION ========
function generateToken(user) {
    const jwtPayload = {
        ...user,
    };
    //const jwtSecret = process.env.JWT_SECRET;

    const jwtOptions = {
        expiresIn : '1h',
    };

    return jwt.sign(jwtPayload, jwtKey, jwtOptions);
}

//======= FUNCTION LOGIN ========
function login(req, res) {
    // implement user login
    const credentials = req.body;
    db('users')
          .where({ username : credentials.username })
          .first()
          .then(user => {
              if(user && bcrypt.compareSync(credentials.password, user.password)) {
                    const token = generateToken(user);
                    res.status(200).json({message : "Logged In", token});
              } else {
                    res.status(401).json({message : "Invalid username or password.."})
              }
           })
          .catch(err => res.send({Message : "Error in Logging In..."}));
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
