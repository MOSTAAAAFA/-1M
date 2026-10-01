const { ElevenLabsClient } = require("elevenlabs");

const ELEVENLABS_API_KEY = "sk_3df900f0ec0314e70018b74f52efc9d5cc59f7a483236c31";
const ELEVEN_VOICE_ID = "yrPIy5b3iLnVLIBfUSw8";

async function testElevenLabs() {
  console.log("Testing ElevenLabs TTS service...");
  console.log("API Key:", ELEVENLABS_API_KEY.substring(0, 10) + "...");
  console.log("Voice ID:", ELEVEN_VOICE_ID);
  console.log("");

  const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

  try {
    console.log("Attempting text-to-speech conversion...");
    const stream = await client.textToSpeech.convert(ELEVEN_VOICE_ID, {
      text: "مرحبا",
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    stream.on("end", () => {
      const audio = Buffer.concat(chunks);
      console.log("✓ SUCCESS: Audio generated");
      console.log("Audio size:", audio.length, "bytes");
    });

    stream.on("error", (err) => {
      console.error("✗ STREAM ERROR:", err);
    });

  } catch (err) {
    console.error("\n✗ CAUGHT ERROR:");
    console.error("Type:", err.constructor.name);
    console.error("Status:", err.status || err.statusCode || "N/A");
    console.error("Status Code:", err.statusCode);
    console.error("Code:", err.code);
    console.error("Message:", err.message);
    console.error("\nFull error object:");
    console.error(JSON.stringify(err, null, 2));
    console.error("\nError keys:", Object.keys(err));

    // Try to extract more details
    if (err.response) {
      console.error("\nResponse data:", err.response.data);
      console.error("Response status:", err.response.status);
      console.error("Response headers:", err.response.headers);
    }

    if (err.body) {
      console.error("\nError body:", err.body);
    }

    process.exit(1);
  }
}

testElevenLabs();
