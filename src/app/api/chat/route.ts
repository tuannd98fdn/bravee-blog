import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { searchPosts } from '@/lib/search';
import { ratelimit, ratelimitHourly } from '@/lib/rate-limit';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const AUTHOR_INFO = `
THÔNG TIN TÁC GIẢ:
- Tên: Tuấn Nguyễn Đình (Bravee)
- Vai trò: Full-stack Engineer / Technical Lead tại FPT Software
- Kinh nghiệm: 3+ năm
- Dự án: Hệ thống quản lý khách sạn quy mô lớn cho khách hàng Nhật Bản
- Kỹ năng cốt lõi: Java, Spring Boot, AWS (EC2, S3, Lambda, RDS), DevOps (Docker, Kubernetes, CI/CD), Microservices, React/Next.js, AI Agents (LangGraph, CrewAI), LLMOps, RAG
- Vị trí: Đà Nẵng, Việt Nam
- LinkedIn: https://www.linkedin.com/in/tuan-nguyen-dinh-283176302/
- GitHub: https://github.com/tuannd98fdn
- Định hướng: Phát triển thành Principal Software Engineer / AI Engineer
`;

export async function POST(req: Request) {
  // ── Two-tier rate limiting ────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

  const [perMin, perHour] = await Promise.all([
    ratelimit.limit(ip),
    ratelimitHourly.limit(ip),
  ]);

  if (!perMin.success) {
    return Response.json(
      { error: '⏳ Bạn gửi quá nhanh! Đợi 1 phút rồi thử lại nhé.' },
      {
        status: 429,
        headers: { 'Retry-After': '60' },
      }
    );
  }
  if (!perHour.success) {
    return Response.json(
      { error: '🚫 Bạn đã dùng hết lượt chat hôm nay (30 lượt/giờ). Quay lại sau nhé!' },
      {
        status: 429,
        headers: { 'Retry-After': '3600' },
      }
    );
  }

  try {
    const { messages } = await req.json();

    // Simple RAG: find relevant posts from the last user message
    const lastUserMsg = [...messages].reverse().find((m: { role: string; content: string }) => m.role === 'user')?.content ?? '';
    const allPosts = getAllPosts();
    const relevantPosts = searchPosts(allPosts, lastUserMsg).slice(0, 3);

    let ragContext = '\n\nCÁC BÀI VIẾT TRÊN BLOG:\n';
    if (relevantPosts.length > 0) {
      for (const post of relevantPosts) {
        const full = getPostBySlug(post.slug);
        ragContext += `\n### ${post.title}\nURL: /blog/${post.slug}\nMô tả: ${post.description}\n`;
        if (full) ragContext += `Nội dung: ${full.content.substring(0, 800)}...\n`;
      }
    } else {
      allPosts.slice(0, 6).forEach(p => {
        ragContext += `- **${p.title}** (/blog/${p.slug}): ${p.description}\n`;
      });
    }

    const dynamicSystem = SYSTEM_PROMPT + AUTHOR_INFO + ragContext;

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: dynamicSystem,
      messages,
    });

    return result.toDataStreamResponse();

  } catch (error: unknown) {
    console.error('[Chat API Error]', error);

    const err = error as { statusCode?: number; message?: string };

    if (err?.statusCode === 429) {
      return Response.json(
        { error: '⏳ AI đang quá tải, vui lòng thử lại sau vài giây!' },
        { status: 429 }
      );
    }
    if (err?.statusCode === 400) {
      return Response.json(
        { error: '❌ Câu hỏi không hợp lệ, vui lòng thử lại.' },
        { status: 400 }
      );
    }
    return Response.json(
      { error: '❌ Lỗi kết nối AI. Vui lòng thử lại sau!' },
      { status: 500 }
    );
  }
}
