
# Entertainement Bases API

This API is used by a public marketplace that makes it easy to find a leisure base.

A user can, for example, use this marketplace to find a leisure center that offers wakeboarding and for which the weather is good.

## Installation

First, you need to install all the required npm dependencies
```
$ npm install
```

Then, you should ensure environment variables are available (via a .env file or by adding them in your docker-compose.yml file).
The expected environments variable are:

```
  NODE_ENV: string
  DATABASE_URL: string
  APP_PORT: number
  API_DOC: 'TRUE' | 'FALSE'
  POSTGRES_HOST: string
  POSTGRES_PORT: number
  POSTGRES_USER: string
  POSTGRES_PASSWORD: string
  POSTGRES_DB: string
  WEATHER_API_KEY: string
  JWT_SECRET: string
```

### Ensure an access to OpenWeatherMap

Create an account on the [Open Weather Map site](https://openweathermap.org/) and get an API key that will be used for querying the weather and temperature of a City.

## Running the application

To run directly your application, use:

```
# development
$ npm run start

# watch mode
$ npm run start:dev
```
You an also run the docker compose command to launch both the server and the database
```
$ docker compose up --build
```

## Using Test Data
In order to make the manual testing of the application a python script has been provided to fill the database with some mock data.
You can use it the following way

```
$ python fill_db_example.py <path_to_your_json_file>
```
A .json file containing some data has been provided at '/test/fake_data/bases.json'

**Note: The credentials of the user used by the script are email:'admin@gmail.com' and password:'root'**

## Troubleshooting

- The behavior of the application when the 'City' field of a base isn't recognize hasn't been tested and isn't handled.
- When requested on [GET] /bases, if the request query contains both 'search' and 'activity', the application provides the the result concatenated for those two fields and will not combine them

## Stay in Touch
- Author: Valentin SOYER
- LinkedIn: https://www.linkedin.com/in/valentin-soyer/