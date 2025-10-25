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

export async function syncTariffs(): Promise<void> {
    try {
        const tariffs = await knex("tariffs").select("*").orderBy("box_delivery_coef_expr", "asc");

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

        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: env.SHEET_ID,
        });

        const sheetExists = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === "stocks_coefs");

        if (!sheetExists) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: env.SHEET_ID,
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

        await sheets.spreadsheets.values.update({
            spreadsheetId: env.SHEET_ID,
            range: "stocks_coefs!A1",
            valueInputOption: "RAW",
            requestBody: {
                values: data,
            },
        });
    } catch (error) {
        console.error("Error syncing tariffs to Google Sheets:", error);
        throw error;
    }
}
