import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 프로젝트 글: 문제 → 판단/설계 → 아키텍처 → 성과(수치) 흐름으로 작성
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    org: z.string().optional(),
    period: z.string().optional(),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    metrics: z.array(z.string()).default([]),
    before: z.string().optional(),
    after: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

// 아키텍처 정리: 재사용 가능한 설계 패턴/심화 기록
const architecture = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/architecture' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(99),
  }),
});

export const collections = { projects, architecture };
