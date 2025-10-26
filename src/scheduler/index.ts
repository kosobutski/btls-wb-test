import { updateGoogleSheets } from "#services/googlesheets.service.js";
import { syncTariffsWithDatabase } from "#services/sync.service.js";
import schedule from "node-schedule";

export function startScheduler() {
    // каждые 0 минут каждого часа БД синхронизируется с API
    schedule.scheduleJob("0 * * * *", async () => {
        await syncTariffsWithDatabase();
    });

    // каждые 5 минут каждого часа обновляются гугл таблицы
    schedule.scheduleJob("5 * * * *", async () => {
        await updateGoogleSheets();
    });

    console.log("Scheduler started");
}
