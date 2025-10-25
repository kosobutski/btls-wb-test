import knex, { migrate, seed } from "#postgres/knex.js";
import { startScheduler } from "#scheduler/index.js";
import { updateGoogleSheet } from "#services/googlesheets.service.js";

await knex.migrate.latest();
await knex.seed.run();

console.log("All migrations and seeds have been run");

startScheduler();
