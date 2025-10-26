import knex from "#postgres/knex.js";
import { WarehouseTariff } from "#utils/interfaces.js";

// функция для парсинга float-чисел
const parseDecimal = (value: string | null | undefined): number | null => {
    if (!value) return null;
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? null : parsed;
};

export async function saveTariffs(tariffs: WarehouseTariff[], date: string): Promise<void> {
    try {
        // сбор данных
        const mappedTariffs = tariffs.map((tariff) => ({
            date,
            warehouse_name: tariff.warehouseName,
            geo_name: tariff.geoName,
            box_delivery_base: parseDecimal(tariff.boxDeliveryBase),
            box_delivery_coef_expr: parseDecimal(tariff.boxDeliveryCoefExpr),
            box_delivery_liter: parseDecimal(tariff.boxDeliveryLiter),
            box_delivery_marketplace_base: parseDecimal(tariff.boxDeliveryMarketplaceBase),
            box_delivery_marketplace_coef_expr: parseDecimal(tariff.boxDeliveryMarketplaceCoefExpr),
            box_delivery_marketplace_liter: parseDecimal(tariff.boxDeliveryMarketplaceLiter),
            box_storage_base: parseDecimal(tariff.boxStorageBase),
            box_storage_coef_expr: parseDecimal(tariff.boxStorageCoefExpr),
            box_storage_liter: parseDecimal(tariff.boxStorageLiter),
        }));

        // запись данных
        await knex("tariffs").insert(mappedTariffs).onConflict(["date", "warehouse_name"]).merge();
        console.log(`Tariffs are successfully inserted to database at ${new Date().toLocaleString()}`);
    } catch (error) {
        throw new Error(`Error while saving tariffs to database: ${error}`);
    }
}
