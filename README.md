# Installation

This application requires Docker to work, turn on docker then run the following command to start:

```bash
$ docker-compose up -d
```

# SAGA Pattern - Choreography

We chose to use choreography to implement the SAGA pattern, as it is a more decentralized approach, where each service is responsible for its own transactions and the communication between services is done through events. This way, we can avoid a single point of failure and make the system more scalable. Since it's a fairly simple flow of order creation, we decided to use this approach.

# Trying the app

After containers are up, the api will be available at [http://localhost:3002](http://localhost:3002)

## Locally without Docker
If you'd like to run locally, offside the container, follow the next steps:

### Create .env from .sample
- Copy .env.sample and rename it to .env

After containers are up, turn of the app container and run the following commands:

### Install dependencies
```bash
$ npm install
```

### Run migrations

```bash
$ npm run update-migrations
```

### Run the app

```bash
# development
$ npm run dev
```

```
## DOCS

After app starts running, go to [http://localhost:3002/doc](http://localhost:3002/doc) to check the swagger doc.