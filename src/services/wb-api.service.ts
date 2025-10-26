import env from "#config/env/env.js";
import { TariffResponse, WarehouseTariff } from "#utils/interfaces.js";

// запрашиваем информацию о тарифах на какую-либо дату и возвращаем в виде JSON
export async function fetchTariffs(date: string): Promise<WarehouseTariff[]> {
    const url = `https://common-api.wildberries.ru/api/v1/tariffs/box?date=${date}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${env.WB_API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`WB API error: ${response.status} ${response.statusText}`);
    }

    const data: TariffResponse = await response.json();
    const warehouseList: WarehouseTariff[] = data.response.data.warehouseList;
    return warehouseList;
}
