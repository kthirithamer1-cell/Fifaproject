const fs = require("fs");

async function run() {
  console.log("🚀 Requesting card generation directly from OpenAI API (gpt-image-1) ...");
  const payload = fs.readFileSync("test_prompt.json", "utf-8");
  const apiKey = "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";

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: payload,
  });

  const data = await res.json();
  if (data.error) {
    console.error("❌ OpenAI API Error:", data.error.message);
    return;
  }

  const base64Image = data.data[0]?.b64_json;
  if (!base64Image) {
    console.error("❌ No image data returned.");
    return;
  }

  fs.writeFileSync("output.png", Buffer.from(base64Image, "base64"));
  console.log("✅ Success! Card image saved to output.png");
}

run().catch(console.error);
