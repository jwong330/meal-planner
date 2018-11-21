# Meal Planner

Meal Planner is a simple CRUD application that allows users to plan/track their meals.

## Build

In the root directory, install dependencies.

```bash
npm install
```

Install forver (CLI tool to ensure that a given script runs continuously).

```bash
npm install forever
```

Run forever on a port number (portno). Ensure that the port number used in the command matches the one
declared in app.js. Example below is running the application on port number 58188.

```javascript
//Set up port
app.set("port", 58188);
```

```bash
./node_modules/forever/bin/forever start app.js 58188
```

## Access the application
