'use client';
import { useState } from 'react';

const POSTS = [
  { id: 1, caption: '🤖 5 AI tools that are changing the game in 2026. Which one is your favorite? Drop a comment below! #AI #Technology #Productivity', platform: 'Instagram', status: 'published', time: '2 days ago', likes: '3.8K', comments: '234' },
  { id: 2, caption: 'ChatGPT vs Gemini vs Claude — we tested all three so you don\'t have to. Here\'s what we found 👇 #AItools #ChatGPT #Gemini', platform: 'Twitter/X', status: 'scheduled', time: 'Today 9:00 AM', likes: '-', comments: '-' },
  { id: 3, caption: 'The future of content creation is here. AI is doing the research, scripting, voiceover, AND publishing automatically. #ContentCreation #AIAutomation', platform: 'Facebook', status: 'draft', time: 'Draft', likes: '-', comments: '-' },
];

export default function PostsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary">✦ Create Post</button>
      </div>
      {POSTS.map(post => (
        <div key={post.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="badge badge-blue">{post.platform}</span>
              <span className={`badge ${post.status === 'published' ? 'badge-green' : post.status === 'scheduled' ? 'badge-orange' : 'badge-gray'}`}>{post.status}</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.time}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 12 }}>{post.caption}</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            {post.likes !== '-' && <><span>❤️ {post.likes}</span><span>💬 {post.comments}</span></>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm">Edit</button>
              <button className="btn btn-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
