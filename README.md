# express-graphql

Small demo of using graphql in express on node

## About the app

* Uses latest es6 features
* Auth Prettier linting
* Graphql Api
* Scenario of using two mongo database
* Mongoose ORM find, create, update
* Top down dependancies injection
* Services and factory patterns
* Standing up html views
* Server search, sort, take, skip on records
* Sample JWT auth
* Docker sample

This app is for teaching and is not production ready but with a few addon/tweaks/logging it can be!

## How to setup and run

you will need 1-2 mongo instance up and running

1.) Run the command npm install

2.) Create a file named .env at same level as this readme

3.) Add following data in your .env file
```
MONGO_URL_1=your-mongo-url-1-here
MONGO_URL_2=your-mongo-url-2-here-or-1-if-you-dont-have-another
```

4.) Run the command npm start or npm run dev (for auto prettier linter)

5.) Once database & auth is connected and ready,

6.) Open your browser and go to localhost:3000 and read the instruction to login.

7.) You will be redirected to localhost:3000/api/graphql on success

8.) Enjoy playing around with graphql and code!