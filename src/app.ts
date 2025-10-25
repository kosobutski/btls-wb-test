import knex, { migrate, seed } from "#postgres/knex.js";
import { startScheduler } from "#scheduler/index.js";

process.env.TZ = "UTC";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

startScheduler();
