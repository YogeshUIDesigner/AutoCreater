// ==========================================
// Provider Interfaces — all AI providers must implement these
// Change provider without changing business logic
// ==========================================

// ---- AI Provider (text/research/scripts) ----
export interface AIProvider {
  researchTopic(niche: string, language: string): Promise<TopicResearchResult>;
  generateScript(topic: string, settings: ScriptSettings): Promise<Script>;
  generateMetadata(title: string, description: string): Promise<ContentMetadata>;
  factCheck(content: string): Promise<FactCheckResult>;
}

export interface TopicResearchResult {
  title: string;
  hook: string;
  keyPoints: string[];
  targetKeywords: string[];
  estimatedViews: number;
}

export interface ScriptSettings {
  duration: number; // minutes
  tone: string;
  language: string;
  audience: string;
  style: string;
}

export interface Script {
  title: string;
  hook: string;
  scenes: ScriptScene[];
  cta: string;
  totalDuration: number;
}

export interface ScriptScene {
  order: number;
  narration: string;
  visualPrompt: string;
  duration: number;
}

export interface ContentMetadata {
  seoTitle: string;
  description: string;
  tags: string[];
  hashtags: string[];
}

export interface FactCheckResult {
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
}

// ---- Video Provider ----
export interface VideoProvider {
  generateVideo(scenes: ScriptScene[], settings: VideoSettings): Promise<{ operationId: string }>;
  checkStatus(operationId: string): Promise<VideoOperationStatus>;
  downloadVideo(operationId: string): Promise<string>; // Returns storage URL
}

export interface VideoSettings {
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p' | '4k';
  style: string;
  voiceUrl?: string;
  musicTrack?: string;
  watermark?: string;
}

export interface VideoOperationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  videoUrl?: string;
  error?: string;
}

// ---- Voice Provider ----
export interface VoiceProvider {
  synthesize(text: string, settings: VoiceSettings): Promise<Buffer>;
  getAvailableVoices(): Promise<VoiceOption[]>;
}

export interface VoiceSettings {
  voice: string;
  language: string;
  speed: number;
  pitch: number;
  emotion?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  preview?: string;
}

// ---- Image Provider ----
export interface ImageProvider {
  generateImage(prompt: string, settings: ImageSettings): Promise<string>; // Returns URL
  generateThumbnail(title: string, settings: ThumbnailSettings): Promise<string[]>; // Returns 2-3 variants
}

export interface ImageSettings {
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:5';
  style: string;
  negativePrompt?: string;
}

export interface ThumbnailSettings {
  style: 'ai_generated' | 'template' | 'custom';
  brandColors: string[];
  logoUrl?: string;
  textStyle: string;
}

// ---- Storage Provider ----
export interface StorageProvider {
  upload(buffer: Buffer, path: string, mimeType: string): Promise<string>; // Returns public URL
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string>;
  delete(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}

// ---- Publishing Provider ----
export interface PublishingProvider {
  publishVideo(video: VideoPublishPayload): Promise<PublishResult>;
  publishCarousel(carousel: CarouselPublishPayload): Promise<PublishResult>;
  publishPost(post: PostPublishPayload): Promise<PublishResult>;
  scheduleContent(payload: SchedulePayload): Promise<PublishResult>;
  getAccountInfo(accessToken: string): Promise<AccountInfo>;
}

export interface VideoPublishPayload {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  tags: string[];
  privacy: 'public' | 'unlisted' | 'private';
  categoryId?: string;
  accessToken: string;
}

export interface CarouselPublishPayload {
  imageUrls: string[];
  caption: string;
  hashtags: string[];
  accessToken: string;
}

export interface PostPublishPayload {
  text: string;
  imageUrl?: string;
  hashtags: string[];
  accessToken: string;
}

export interface SchedulePayload {
  publishAt: Date;
  payload: VideoPublishPayload | CarouselPublishPayload | PostPublishPayload;
  type: 'video' | 'carousel' | 'post';
  accessToken: string;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  url?: string;
  error?: string;
  limitations?: string[];
}

export interface AccountInfo {
  id: string;
  name: string;
  handle: string;
  followers: number;
  avatar?: string;
}

// ---- Provider Registry ----
export type ProviderType = 'ai' | 'video' | 'voice' | 'image' | 'storage' | 'publishing';
