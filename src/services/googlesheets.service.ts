import { google } from "googleapis";
import env from "#config/env/env.js";
import knex from "#postgres/knex.js";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: env.GOOGLE_SERVICE_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function updateGoogleSheets(): Promise<void> {
    try {
        const tariffs = await knex("tariffs").select("*").orderBy("box_delivery_coef_expr", "asc");

        // заголовки столбцов таблиц
        const headers = [
            "ID",
            "Date",
            "Warehouse Name",
            "Geo Name",
            "Box Delivery Base",
            "Box Delivery Coef Expr",
            "Box Delivery Liter",
            "Box Delivery Marketplace Base",
            "Box Delivery Marketplace Coef Expr",
            "Box Delivery Marketplace Liter",
            "Box Storage Base",
            "Box Storage Coef Expr",
            "Box Storage Liter",
            "Created At",
            "Updated At",
        ];

        // сбор данных о тарифах из БД
        const values = tariffs.map((tariff) => [
            tariff.id,
            tariff.date,
            tariff.warehouse_name,
            tariff.geo_name,
            tariff.box_delivery_base,
            tariff.box_delivery_coef_expr,
            tariff.box_delivery_liter,
            tariff.box_delivery_marketplace_base,
            tariff.box_delivery_marketplace_coef_expr,
            tariff.box_delivery_marketplace_liter,
            tariff.box_storage_base,
            tariff.box_storage_coef_expr,
            tariff.box_storage_liter,
            tariff.created_at,
            tariff.updated_at,
        ]);

        const data = [headers, ...values];

        // получение идентификаторов гугл таблиц
        const spreadsheetRecords = await knex("spreadsheets").select("spreadsheet_id");

        for (const record of spreadsheetRecords) {
            const spreadsheetId = record.spreadsheet_id;

            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId,
            });

            const sheetExists = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === "stocks_coefs");

            // если листа stocks_coefs в таблице нет, то создаем его
            if (!sheetExists) {
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: {
                                        title: "stocks_coefs",
                                    },
                                },
                            },
                        ],
                    },
                });
            }

            // запись в гугл таблицы
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: "stocks_coefs!A1",
                valueInputOption: "RAW",
                requestBody: {
                    values: data,
                },
            });
            console.log(`Google Spreadsheet ${spreadsheetId} is successfully updated at ${new Date().toLocaleString()}`);
        }
    } catch (error) {
        console.error("Error syncing tariffs to Google Sheets:", error);
        throw error;
    }
}
