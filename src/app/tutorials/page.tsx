import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostsBySeries } from '@/lib/mdx';
import styles from './tutorials.module.css';

export const metadata: Metadata = {
  title: 'Tutorials & Learning Tracks',
  description: 'Step-by-step practical roadmaps and tutorials on AI Engineering, AWS Cloud Architecture, and Software Development.',
};

interface TutorialTrack {
  title: string;
  seriesName: string;
  emoji: string;
  description: string;
  level: string;
}

const TRACKS: TutorialTrack[] = [
  {
    title: 'Lộ Trình AI Engineer Thực Chiến (6 Parts)',
    seriesName: 'Lộ Trình AI Engineer Thực Chiến',
    emoji: '🤖',
    description: 'Khóa học thực chiến từ số 0 dành cho Web/Mobile Dev: Bẻ khóa tư duy LLM, RAG & Vector Database, Function Calling, Autonomous AI Agents, Anthropic MCP, và vận hành Production LLMOps.',
    level: 'Beginner to Advanced',
  },
  {
    title: 'LangChain & LangGraph Thực Chiến',
    seriesName: 'LangChain Thực Chiến',
    emoji: '⚡',
    description: 'Xây dựng ứng dụng Generative AI hoàn chỉnh với Python, Flask, IBM watsonx.ai, tích hợp Document RAG và Chat Memory.',
    level: 'Intermediate',
  },
  {
    title: 'Chinh Phục AWS Solutions Architect (SAP-C02)',
    seriesName: 'AWS SAP-C02 Thực Chiến',
    emoji: '☁️',
    description: 'Hệ thống hóa kiến trúc đám mây nâng cao: Tổng quan cấu trúc đề thi SAP-C02, hiểu sâu về Identity & Access Management (IAM), STS, và bảo mật Cloud Enterprise.',
    level: 'Professional',
  },
];

export default async function TutorialsPage() {
  const tracksWithPosts = await Promise.all(
    TRACKS.map(async (track) => {
      const posts = await getPostsBySeries(track.seriesName);
      return {
        ...track,
        posts,
      };
    })
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tutorials & Learning Tracks</h1>
        <p className={styles.subtitle}>
          Step-by-step practical tutorials, engineering deep dives, and structured series to help you master modern software technologies.
        </p>
      </header>

      <div className={styles.trackList}>
        {tracksWithPosts.map((track) => (
          <div key={track.title} className={styles.trackCard}>
            <div className={styles.trackHeader}>
              <div>
                <div className={styles.trackTitleArea}>
                  <span className={styles.trackEmoji}>{track.emoji}</span>
                  <h2 className={styles.trackTitle}>{track.title}</h2>
                </div>
                <p className={styles.trackDesc}>{track.description}</p>
              </div>
              <span className={styles.trackBadge}>{track.level}</span>
            </div>

            <div className={styles.stepsList}>
              {track.posts.map((post, idx) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.stepItem}
                >
                  <div className={styles.stepLeft}>
                    <span className={styles.stepIndex}>
                      Part {post.seriesOrder || idx + 1}
                    </span>
                    <span className={styles.stepTitle}>
                      {post.title.replace(/^\[.*?\]\s*/, '')}
                    </span>
                  </div>

                  <div className={styles.stepMeta}>
                    <span>{post.readingTime}</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
