const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile");
const actionRoutes = require("./data/Routes/actionRoutes");
const projectRoutes = require("./data/Routes/projectRoutes");
const db = knex(knexConfig.development);

// server
const server = express();

// Middleware
server.use(helmet());
server.use(express.json());

server.use("/api/actions", actionRoutes);
server.use("/api/projects", projectRoutes);

// Listen on...
const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
