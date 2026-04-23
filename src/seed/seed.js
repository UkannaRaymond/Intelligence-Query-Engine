import fs from "fs";
import path from "path";
import { v7 as uuidv7 } from "uuid";
import { pool } from "../config/db.js";

const filePath = path.resolve("data/seed_profiles.json");

let data;
try {
  const raw = fs.readFileSync(filePath, "utf-8");
  data = JSON.parse(raw).profiles;

  if (!Array.isArray(data)) {
    throw new Error("Expected a 'seed_profiles' array in seed_profiles.json");
  }
} catch (err) {
  console.error("[seed] Failed to read seed file:", err.message);
  process.exit(1);
}

async function seed() {
  console.log(`[seed] Seeding ${data.length} profiles...`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of data) {
    try {
      const result = await pool.query(
        `
        INSERT INTO profiles (
          id, name, gender, gender_probability,
          age, age_group, country_id, country_name,
          country_probability
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (name) DO NOTHING
        `,
        [
          uuidv7(),
          p.name,
          p.gender,
          p.gender_probability,
          p.age,
          p.age_group,
          p.country_id,
          p.country_name,
          p.country_probability,
        ],
      );

      if (result.rowCount === 0) {
        skipped++;
      } else {
        inserted++;
      }
    } catch (err) {
      console.error(
        `[seed] Failed to insert profile "${p.name}":`,
        err.message,
      );
      failed++;
    }
  }

  console.log(
    `[seed] Done. Inserted: ${inserted} | Skipped (duplicate): ${skipped} | Failed: ${failed}`,
  );
  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

seed();
