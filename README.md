# JWTAuthMongodb
A Node.js app using [Express 4](http://expressjs.com/). Implementing JWT Auth with Mongodb, Passport local.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/pritamkhose/JWTAuthMongodb.git # or clone your own fork
cd JWTAuthMongodb
npm install
npm nodemon
```
Your app should now be running on [localhost:3000](http://localhost:3000/).

## Update MongoDB credentials
In [app.js](/blob/master/app.js) file replace mongodb_username, mongodb_password and mongodb_database_name with your valid credentials [MongoDB Cloud](https://www.mongodb.com/cloud/) or use localhost URL for Local MongoDB. 


## Documentation

Import [Postman request](/blob/master/auth2019.postman_collection.json) for test application within [Postman](https://www.getpostman.com/downloads/).

For more information about using Node.js articles:

- [Getting Started with Node.js Project](https://expressjs.com/en/starter/generator.html)
- [Install nodemon](https://www.npmjs.com/package/nodemon)
- [PassportJS](http://www.passportjs.org/docs/username-password/)