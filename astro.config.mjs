// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';

// 레포 이름이 `Kyeongju.github.io` 이므로 루트 도메인에 배포됩니다.
// 일반 레포(예: `portfolio`)로 옮기면 base: '/portfolio' 를 추가하세요.
export default defineConfig({
  site: 'https://kyeongju.github.io',
  integrations: [
    // mermaid 는 markdown 변환 통합(mdx)보다 먼저 와야 합니다.
    mermaid({ theme: 'neutral' }),
    mdx(),
    sitemap(),
  ],
});
