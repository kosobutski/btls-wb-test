import { WarehouseTariff } from "#utils/interfaces.js";
import { saveTariffs } from "./database.service.js";
import { fetchTariffs } from "./wb-api.service.js";

export async function syncTariffsWithDatabase() {
    const today = new Date().toISOString().split("T")[0];
    const tariffs: WarehouseTariff[] = await fetchTariffs(today);
    await saveTariffs(tariffs, today);
}
