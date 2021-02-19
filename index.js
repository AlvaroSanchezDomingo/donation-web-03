"use strict";

const Cookie = require("@hapi/cookie");
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Handlebars = require("handlebars");
const env = require('dotenv');


env.config();

require('./app/models/db');

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});


async function init() {
  await server.register(Cookie);
  await server.register(Inert);
  await server.register(Vision);
  server.views({
    engines: {
      hbs: require("handlebars"),
    },
    relativeTo: __dirname,
    path: "./app/views",
    layoutPath: "./app/views/layouts",
    partialsPath: "./app/views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false
    },
    redirectTo:'/',
  });
  server.auth.default('session');

  server.route(require("./routes"));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
