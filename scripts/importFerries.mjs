import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env
dotenv.config();

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get file path from CLI args
const fileArg = process.argv[2];

if (!fileArg || !fileArg.endsWith(".json")) {
  console.error("❌ Please provide a valid JSON file path. Example:");
  console.error(
    "   node scripts/importFerries.js ./src/data/fullFerriesFromAnguillaMay2025.json"
  );
  process.exit(1);
}

const fullPath = path.resolve(fileArg);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

// Converts MM-DD-YY to YYYY-MM-DD
function formatDate(dateStr) {
  const [month, day, year] = dateStr.split("-");
  return `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Map camelCase JSON to snake_case DB schema
function toSnakeCaseFerry(ferry) {
  return {
    operator: ferry.operator,
    departure_port: ferry.departurePort,
    arrival_port: ferry.arrivalPort,
    departure_time: ferry.departureTime,
    arrival_time: ferry.arrivalTime || null,
    price: parseFloat(ferry.price.replace("$", "")) || 30,
    duration: ferry.duration,
    vessel_name: ferry.vesselName || null,
    status: ferry.status || "scheduled",
    direction: ferry.direction,
    schedule_date: formatDate(ferry.date),
    logo_url: ferry.logoUrl,
    ferry_type: ferry.ferry_type || "Public Ferry",
    created_by: "ec268f36-ebd0-4f72-be47-34309ac8695d", // add this line
  };
}

// Run import
async function importFerryData(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const ferryData = JSON.parse(rawData);

    const chunkSize = 400;
    const total = ferryData.length;

    for (let i = 0; i < total; i += chunkSize) {
      const chunk = ferryData.slice(i, i + chunkSize);
      const mappedChunk = chunk.map(toSnakeCaseFerry);

      const { error } = await supabase
        .from("ferry_schedules")
        .insert(mappedChunk);

      if (error) {
        console.error(
          `❌ Error inserting chunk ${i}-${i + chunk.length}:`,
          error.message
        );
        process.exit(1);
      }

      console.log(
        `✅ Inserted ${mappedChunk.length} records (${i + 1}-${
          i + mappedChunk.length
        })`
      );
    }

    console.log(
      `🎉 Import complete: ${total} records from ${path.basename(filePath)}`
    );
  } catch (err) {
    console.error("❌ Failed to import:", err.message || err);
  }
}

importFerryData(fullPath);
