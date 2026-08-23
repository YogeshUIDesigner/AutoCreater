import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';

// Set the path to the ffmpeg binary from the installer package
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface RenderOptions {
  videoPaths: string[];
  audioPath: string;
  outputPath: string;
  width: number;
  height: number;
  durationSeconds: number; // Total duration of the audio
}

/**
 * Renders the final video by stitching clips, scaling to target size,
 * and overlaying the main audio.
 */
export async function renderFinalVideo(options: RenderOptions): Promise<string> {
  const { videoPaths, audioPath, outputPath, width, height, durationSeconds } = options;

  console.log(`[FFmpeg] Rendering final video to ${outputPath}...`);

  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // 1. Add all video inputs
    videoPaths.forEach(vp => command.input(vp));

    // 2. Add audio input
    command.input(audioPath);

    // 3. Build complex filter for scaling, cropping and concatenating
    // We want to fill the screen (scale+crop) for each input to match width x height
    const filterParts: string[] = [];
    
    videoPaths.forEach((_, i) => {
      // Scale to cover the target box, then crop to exact size.
      // We force SAR to 1:1 and set fps to 30 for consistency.
      const scaleStr = `scale='max(${width}/iw,${height}/ih)*iw':'max(${width}/iw,${height}/ih)*ih'`;
      const cropStr = `crop=${width}:${height}`;
      const setPts = `setpts=PTS-STARTPTS`;
      
      filterParts.push(`[${i}:v]${scaleStr},${cropStr},${setPts},fps=30[v${i}]`);
    });

    // Concat all processed video streams
    const concatInputs = videoPaths.map((_, i) => `[v${i}]`).join('');
    filterParts.push(`${concatInputs}concat=n=${videoPaths.length}:v=1:a=0[vout]`);

    // 4. Set filter complex (join all parts with a semicolon so it's one filtergraph)
    command.complexFilter(filterParts.join('; '));

    // 5. Output options
    command
      .outputOptions([
        '-map [vout]',                  // Use the concatenated video stream
        `-map ${videoPaths.length}:a`,  // Use the audio stream (it's the last input)
        '-c:v libx264',                 // H.264 codec
        '-preset fast',                 // Encoding speed
        '-crf 23',                      // Quality (lower is better)
        '-c:a aac',                     // AAC audio codec
        '-b:a 192k',                    // Audio bitrate
        '-shortest',                    // End encoding when the shortest stream ends (usually the audio)
        `-t ${Math.ceil(durationSeconds)}` // Ensure it doesn't go longer than the audio
      ])
      .output(outputPath)
      .on('start', (cmdline) => {
        console.log('[FFmpeg] Spawned Ffmpeg with command: ' + cmdline);
      })
      .on('progress', (progress) => {
        console.log(`[FFmpeg] Processing: ${progress.percent ? progress.percent.toFixed(2) : 0}% done`);
      })
      .on('end', () => {
        console.log('[FFmpeg] Rendering completed successfully!');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('[FFmpeg] Error during rendering:', err);
        reject(err);
      });

    // Run the command
    command.run();
  });
}
