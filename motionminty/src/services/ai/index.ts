/**
 * Mock AI Provider — returns realistic fake data for Phase 1.
 * Set MOCK_PROVIDERS=true in .env.local to use this.
 * Replace with GeminiProvider when real API keys are available.
 */

import type { AIProvider, TopicResearchResult, Script, ScriptSettings, ContentMetadata, FactCheckResult } from './index';

const DELAY = () => new Promise(r => setTimeout(r, parseInt(process.env.MOCK_JOB_DELAY_MS ?? '1500')));

export class MockAIProvider implements AIProvider {
  async researchTopic(niche: string, language: string): Promise<TopicResearchResult> {
    await DELAY();
    return {
      title: `5 AI Tools Transforming ${niche} in 2026`,
      hook: `Did you know that 73% of ${niche} professionals are already using AI? Here are the tools they don't want you to know about.`,
      keyPoints: [
        'Tool #1: Automates repetitive research tasks',
        'Tool #2: Generates content in seconds',
        'Tool #3: Analyzes data better than humans',
        'Tool #4: Handles customer communication',
        'Tool #5: Replaces expensive software subscriptions',
      ],
      targetKeywords: [`AI ${niche}`, `best AI tools 2026`, `${niche} automation`, 'artificial intelligence'],
      estimatedViews: Math.floor(Math.random() * 150000) + 50000,
    };
  }

  async generateScript(topic: string, settings: ScriptSettings): Promise<Script> {
    await DELAY();
    return {
      title: topic,
      hook: `Stop what you're doing. In the next ${settings.duration} minutes, I'm going to show you something that will change how you work forever.`,
      scenes: Array.from({ length: 5 }, (_, i) => ({
        order: i + 1,
        narration: `[Scene ${i + 1}] This is where we talk about point ${i + 1} of our ${settings.tone.toLowerCase()} guide on "${topic}". The content is tailored for ${settings.audience}.`,
        visualPrompt: `Cinematic shot of ${topic} scene ${i + 1}, ${settings.style} style, professional lighting, 4K`,
        duration: Math.floor(settings.duration * 60 / 5),
      })),
      cta: `If you found this helpful, like and subscribe. I post new AI content every day. See you in the next video!`,
      totalDuration: settings.duration * 60,
    };
  }

  async generateMetadata(title: string, description: string): Promise<ContentMetadata> {
    await DELAY();
    return {
      seoTitle: `${title} | Complete Guide 2026`,
      description: `${description}\n\n🔔 Subscribe for daily AI content\n📧 Business inquiries: contact@autocreator.ai\n\n#AI #ArtificialIntelligence #Technology #Productivity`,
      tags: ['AI', 'Technology', 'Productivity', 'Tutorial', '2026', 'Artificial Intelligence', 'Machine Learning'],
      hashtags: ['#AI', '#ArtificialIntelligence', '#Tech', '#Productivity', '#ContentCreation', '#Automation'],
    };
  }

  async factCheck(content: string): Promise<FactCheckResult> {
    await DELAY();
    return {
      riskLevel: 'low',
      flags: [],
    };
  }
}

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async researchTopic(niche: string, language: string): Promise<TopicResearchResult> {
    // TODO: Implement with @google/generative-ai
    // const model = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({ model: 'gemini-pro' });
    throw new Error('GeminiProvider: Set GEMINI_API_KEY and implement real API call');
  }

  async generateScript(topic: string, settings: ScriptSettings): Promise<Script> {
    throw new Error('GeminiProvider: Not yet implemented');
  }

  async generateMetadata(title: string, description: string): Promise<ContentMetadata> {
    throw new Error('GeminiProvider: Not yet implemented');
  }

  async factCheck(content: string): Promise<FactCheckResult> {
    throw new Error('GeminiProvider: Not yet implemented');
  }
}

// Factory — reads from environment
export function createAIProvider(): AIProvider {
  // Always use Mock for testing until Gemini is implemented
  return new MockAIProvider();
}
