const fs = require("fs");

async function testGenerate() {
    try {
        console.log("🚀 Testing FIFA Card Generator API...");
        const jsonBody = fs.readFileSync("test_local.json", "utf-8");

        const response = await fetch("http://localhost:3000/api/generate-card", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonBody,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ API Error:", data);
            return;
        }

        if (data.imageUrl) {
            const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            fs.writeFileSync("output.png", buffer);
            console.log("✅ Card image successfully saved to output.png!");
        } else {
            console.error("❌ Response missing imageUrl:", data);
        }
    } catch (err) {
        console.error("❌ Request Error:", err);
    }
}

testGenerate();
