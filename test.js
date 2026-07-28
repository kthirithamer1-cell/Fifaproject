const fs = require("fs");

async function run() {
  console.log("🚀 Requesting card generation from http://localhost:3000/api/generate-card ...");
  const payload = fs.readFileSync("test_local.json", "utf-8");
  const res = await fetch("http://localhost:3000/api/generate-card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  const data = await res.json();
  if (data.error) {
    console.error("❌ Error:", data.error);
    return;
  }

  const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFileSync("output.png", Buffer.from(base64Data, "base64"));
  console.log("✅ Success! Card image saved to output.png");
}

run().catch(console.error);
