import { updateGoogleSheet } from "#services/googlesheets.service.js";
import { syncTariffsWithDatabase } from "#services/sync.service.js";
import schedule from "node-schedule";

export async function startScheduler() {
    schedule.scheduleJob("0 * * * *", async () => {
        await syncTariffsWithDatabase();
    });

    schedule.scheduleJob("/10 * * * *", async () => {
        await updateGoogleSheet();
    });

    console.log("Scheduler started");
}
