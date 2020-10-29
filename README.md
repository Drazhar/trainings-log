# Trainings-log
This should be a webpage for tracking your workouts and weight.

### Why another workout log?!
Because I wanted a training log which can be used comfortable on mobile and desktop and is flexible enough for logging my workouts, which are mainly body weight training for rock climbing. Most apps I found for this where either only for mobile or to much into training with weights or running. I couldn't find one which I liked. Also I want to improve my coding skills.

# WIP
This readme has still to be created :sweat:

# Deployment/Development
To run the code you first need to create an .env file in the main directory with the following variables:
```
DB_ADDRESS=192.168.0.4  # Address of the postgreSQL server
DB_PORT=5432            # Port of the postgreSQL server
DB_USERNAME=postgres    # Username for the postgreSQL database
DB_PASS=example         # Password of the postgreSQL database
DB_NAME=trainings_app   # Database name of the data
```

If this file is created there are 2 methods to test the app:
### Development
1. Run a database server. Currently this is done with docker, but I need to create a dummy dump file of the database to populate is with some data. #12
1. `npm run node` to start nodemon for the backend
1. `npm start` to start the webpack dev server for the frontend

### Production
1. `npm run build` to build the frontend code to the *static* folder
1. `docker-compose up -d` to run the postgreSQL server and nodeJS backend which will serve the client with the HTML/JS/CSS and the API.
