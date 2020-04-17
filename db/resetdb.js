// load .env data into process.env, connect to DB
require("dotenv").config();
const { Pool } = require("pg");
const dbParams = require("./db.js");
const db = new Pool(dbParams);
db.connect();

// other dependencies
const fs = require("fs");
const chalk = require("chalk");

// Loads the schema files from db/schema
const runSchemaFiles = function () {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync("./schema");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./schema/${fn}`, "utf8");
    console.log(`\t-> Running ${chalk.green(fn)}`);
    db.query(sql).then(console.log("Schema done")).catch("Schema failed");
  }
};

const runSeedFiles = function () {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const schemaFilenames = fs.readdirSync("./seeds");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./seeds/${fn}`, "utf8");
    console.log(`\t-> Running ${chalk.green(fn)}`);
    db.query(sql).then(console.log("Seed done")).catch("Seed failed");
  }
};

try {
  console.log(`-> Connecting to PG using ${dbParams} ...`);
  runSchemaFiles();
  runSeedFiles();
  db.end();
} catch (err) {
  console.error(chalk.red(`Failed due to error: ${err}`));
  db.end();
}
