import fs from 'fs';
import path from 'path';
import { generateTTS } from './tts';
import { getPexelsVideoUrl, downloadMedia } from './media';
import { renderFinalVideo } from './ffmpeg';

export interface VideoJobParams {
  operationId: string;
  script: string;
  keywords: string[];
  format: 'shorts' | 'long';
}

/**
 * Ensures the temporary directory exists.
 */
function getTempDir(operationId: string) {
  const dir = path.join(process.cwd(), '.temp', operationId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Runs the complete Video Generation Engine pipeline.
 */
export async function runVideoEngine(params: VideoJobParams): Promise<string> {
  const { operationId, script, keywords, format } = params;
  console.log(`\n🚀 [Engine] Starting video generation job: ${operationId}`);
  
  const tempDir = getTempDir(operationId);
  const audioPath = path.join(tempDir, 'voice.mp3');
  const finalVideoPath = path.join(tempDir, 'final_render.mp4');

  try {
    // Phase 1: Audio Generation (TTS)
    console.log(`[Engine] Phase 1: Generating Audio...`);
    const { duration } = await generateTTS(script, audioPath);
    console.log(`[Engine] Audio generated. Duration: ${duration.toFixed(2)}s`);

    // Phase 2: Media Acquisition
    // Estimate how many clips we need. Assume 1 clip per 5 seconds of audio.
    const numClips = Math.max(1, Math.ceil(duration / 5));
    console.log(`[Engine] Phase 2: Need approx ${numClips} clips for ${duration.toFixed(1)}s video.`);

    const downloadedClips: string[] = [];
    const orientation = format === 'shorts' ? 'portrait' : 'landscape';

    for (let i = 0; i < numClips; i++) {
      // Pick a keyword cyclically
      const kw = keywords[i % keywords.length] || 'technology abstract';
      
      const videoUrl = await getPexelsVideoUrl(kw, orientation);
      if (videoUrl) {
        const clipPath = path.join(tempDir, `clip_${i}.mp4`);
        await downloadMedia(videoUrl, clipPath);
        downloadedClips.push(clipPath);
        console.log(`[Engine] Downloaded clip ${i + 1}/${numClips} (Keyword: ${kw})`);
      }
    }

    if (downloadedClips.length === 0) {
      throw new Error('Failed to acquire any media clips for the video.');
    }

    // Phase 3 & 4: FFmpeg Rendering
    console.log(`[Engine] Phase 3 & 4: Rendering Final Video with FFmpeg...`);
    const targetWidth = format === 'shorts' ? 1080 : 1920;
    const targetHeight = format === 'shorts' ? 1920 : 1080;

    await renderFinalVideo({
      videoPaths: downloadedClips,
      audioPath,
      outputPath: finalVideoPath,
      width: targetWidth,
      height: targetHeight,
      durationSeconds: duration
    });

    console.log(`🎉 [Engine] Video successfully generated at: ${finalVideoPath}\n`);
    
    // In a production system, we would upload to S3 here.
    // For now, return the local file path (can be served statically if in public/ or just returned as blob).
    
    return finalVideoPath;

  } catch (error) {
    console.error(`❌ [Engine] Job failed:`, error);
    throw error;
  }
}
