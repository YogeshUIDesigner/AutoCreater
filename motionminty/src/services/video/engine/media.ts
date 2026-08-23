import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Searches for a stock video on Pexels and returns the best matching video URL.
 */
export async function getPexelsVideoUrl(query: string, orientation: 'portrait' | 'landscape' = 'portrait'): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey || process.env.MOCK_PROVIDERS === 'true') {
    console.log(`[Media] Mocking Pexels for query: "${query}"`);
    // Return a dummy public video URL
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  }

  console.log(`[Media] Searching Pexels for: "${query}"`);
  
  try {
    const response = await axios.get('https://api.pexels.com/videos/search', {
      params: {
        query,
        orientation,
        size: 'medium', // prefer 1080p
        per_page: 5,
      },
      headers: {
        Authorization: apiKey
      }
    });

    if (response.data.videos && response.data.videos.length > 0) {
      // Get the first video, and find a video file with appropriate resolution
      const video = response.data.videos[0];
      
      // Try to find an HD video file
      let bestFile = video.video_files.find((f: any) => f.quality === 'hd' && f.width >= 720);
      
      if (!bestFile) {
        bestFile = video.video_files[0];
      }
      
      return bestFile.link;
    }
  } catch (err: any) {
    console.error('[Media] Pexels API error:', err.message);
  }

  return null;
}

/**
 * Downloads a media file (video or image) from a URL to the local disk.
 */
export async function downloadMedia(url: string, outputPath: string): Promise<string> {
  console.log(`[Media] Downloading media from ${url.substring(0, 50)}...`);
  
  if (url === 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4') {
    // Generate a dummy video locally using FFmpeg to avoid 403 Forbidden on public buckets
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input('color=c=blue:s=1080x1920:d=5')
        .inputFormat('lavfi')
        .outputOptions(['-pix_fmt yuv420p'])
        .save(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject);
    });
  }

  const writer = fs.createWriteStream(outputPath);
  
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(outputPath));
    writer.on('error', reject);
  });
}
