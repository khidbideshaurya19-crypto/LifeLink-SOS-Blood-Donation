const fs = require("fs");
const csv = require("csv-parser");
const admin = require("firebase-admin");

console.log("🚀 Starting SOS Import Script...");

// ✅ Load Firebase service account key (same folder)
const serviceAccount = require("./serviceAccountKey.json");

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const csvPath = "./sos.csv"; // CSV must be in same folder
console.log("📂 Looking for CSV at:", csvPath);

let count = 0;

fs.createReadStream(csvPath)
  .on("error", (err) => {
    console.error("❌ File Read Error:", err.message);
  })
  .pipe(csv())
  .on("data", async (row) => {
    try {
      await db.collection("sosRequests").add({
        patientName: row.patientName,
        bloodGroup: row.bloodGroup,
        units: Number(row.units || 0),
        urgency: row.urgency,
        notes: row.notes || "",
        status: row.status || "pending",
        hospitalId: row.hospitalId,
        hospitalName: row.hospitalName,
        hospitalCity: row.hospitalCity,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      count++;
      console.log(`✅ Added SOS request for patient: ${row.patientName}`);
    } catch (err) {
      console.error("❌ Firestore Error:", err.message);
    }
  })
  .on("end", () => {
    console.log(`🎉 SOS Requests import finished! Total imported: ${count}`);
  });
