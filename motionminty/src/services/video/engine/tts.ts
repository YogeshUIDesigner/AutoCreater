import fs from 'fs';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

/**
 * Gets the duration of an audio/video file using ffprobe.
 */
export function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
}

/**
 * Generates TTS for a given text and saves it to a file.
 * Returns the path to the audio file and its duration in seconds.
 */
export async function generateTTS(text: string, outputPath: string): Promise<{ audioPath: string; duration: number }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey || process.env.MOCK_PROVIDERS === 'true') {
    // If mocking, return a dummy duration (e.g. 5 seconds for a scene)
    console.log(`[TTS] Mocking audio for: "${text.substring(0, 30)}..."`);
    // Create a dummy silent audio file or just return a fake duration for now
    // Actually, FFmpeg needs a real file to merge. Let's create a silent audio file via FFmpeg.
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input('anullsrc=r=44100:cl=stereo')
        .inputFormat('lavfi')
        .duration(4) // 4 seconds dummy
        .save(outputPath)
        .on('end', () => resolve({ audioPath: outputPath, duration: 4 }))
        .on('error', reject);
    });
  }

  // Real ElevenLabs API call
  // Using default voice: Adam (pNInz6obpgDQGcFmaJcg)
  const voiceId = 'pNInz6obpgDQGcFmaJcg';
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
  console.log(`[TTS] Requesting ElevenLabs audio for: "${text.substring(0, 30)}..."`);
  
  const response = await axios.post(url, {
    text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    }
  }, {
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  const duration = await getMediaDuration(outputPath);
  return { audioPath: outputPath, duration };
}
