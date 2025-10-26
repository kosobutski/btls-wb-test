// Необязательный сид для автоматической вставки идентификаторов гугл-таблиц при выполнении миграции.
// Раскомментируйте код ниже и замените id_* на реальные идентификаторы ваших таблиц.

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    //     await knex("spreadsheets")
    //         .insert([
    //             {
    //                 spreadsheet_id: "id_1",
    //             },
    //             {
    //                 spreadsheet_id: "id_2",
    //             },
    //         ])
    //         .onConflict(["spreadsheet_id"])
    //         .ignore();
}
