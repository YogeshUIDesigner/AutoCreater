/**
 * Mock Store — replaces database in Phase 1 (no PostgreSQL needed).
 * Stores content packages, jobs, automation config in memory.
 * Replace with Prisma DB calls in Phase 2.
 */

export type JobStatus =
  | 'QUEUED' | 'RESEARCHING' | 'SCRIPTING' | 'GENERATING'
  | 'RENDERING' | 'READY' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';

export interface ContentJob {
  id: string;
  userId: string;
  title: string;
  niche: string;
  language: string;
  contentTypes: string[];
  platforms: string[];
  status: JobStatus;
  progress: number;
  logs: string[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  carouselUrls?: string[];
  shortUrl?: string;
  scheduledAt?: Date;
}

// In-memory store (per-process; use Redis in production)
const jobs = new Map<string, ContentJob>();

export const mockStore = {
  createJob(data: Omit<ContentJob, 'id' | 'createdAt' | 'updatedAt' | 'logs' | 'progress' | 'status'>): ContentJob {
    const job: ContentJob = {
      ...data,
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'QUEUED',
      progress: 0,
      logs: [`[${new Date().toISOString()}] Job created`],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jobs.set(job.id, job);
    return job;
  },

  getJob(id: string): ContentJob | undefined {
    return jobs.get(id);
  },

  updateJob(id: string, updates: Partial<ContentJob>): ContentJob | undefined {
    const job = jobs.get(id);
    if (!job) return undefined;
    const updated = { ...job, ...updates, updatedAt: new Date() };
    jobs.set(id, updated);
    return updated;
  },

  addLog(id: string, message: string): void {
    const job = jobs.get(id);
    if (job) {
      job.logs.push(`[${new Date().toISOString()}] ${message}`);
      job.updatedAt = new Date();
    }
  },

  getAllJobs(userId?: string): ContentJob[] {
    const all = Array.from(jobs.values());
    return userId ? all.filter(j => j.userId === userId) : all;
  },

  seedMockJobs(): void {
    if (jobs.size > 0) return;
    const mockTitles = [
      '5 AI Tools That Replace Employees in 2026',
      'ChatGPT vs Gemini vs Claude',
      'How to Make Money with AI in 2026',
    ];
    mockTitles.forEach((title, i) => {
      const statuses: JobStatus[] = ['GENERATING', 'SCHEDULED', 'PUBLISHED'];
      mockStore.createJob({
        userId: 'user_1',
        title,
        niche: 'AI & Technology',
        language: 'English',
        contentTypes: ['long_video', 'short', 'carousel'],
        platforms: ['youtube', 'instagram'],
      });
      const jobId = Array.from(jobs.keys()).at(-1)!;
      mockStore.updateJob(jobId, { status: statuses[i], progress: [65, 100, 100][i] });
    });
  },
};
