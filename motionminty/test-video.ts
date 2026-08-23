import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { runVideoEngine } from './src/services/video/engine/index';

async function main() {
  console.log('Testing Video Generation Engine for Shorts...');

  try {
    const finalVideoPath = await runVideoEngine({
      operationId: `test_short_${Date.now()}`,
      script: "Artificial intelligence is changing the world. It processes data faster than the human brain. Welcome to the future of technology.",
      keywords: ["artificial intelligence", "data processing", "future technology"],
      format: "shorts"
    });

    console.log(`\n✅ TEST SUCCESS! Video created at: ${finalVideoPath}`);
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
  }
}

main();
