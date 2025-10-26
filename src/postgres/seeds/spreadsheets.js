/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([
            {
                spreadsheet_id: "1k7hSV7JOKj5GQ-T1sDNLweYsNCeSPzqIieqxaK0d5Kg",
            },
            {
                spreadsheet_id: "1bNvDpFNx_oJ48779iJwwfO4il2mUWKoDhSFcTMRo_HU",
            },
        ])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
