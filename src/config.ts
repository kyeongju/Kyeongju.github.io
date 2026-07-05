// 사이트 전역 설정. 직접적인 개인정보(실명/연락처/주소/학교명)는 넣지 않습니다.
export const SITE = {
  title: 'DevOps · AI Platform Engineer',
  role: 'DevOps · Platform · AI Platform Engineer',
  tagline: '문제가 터지기 전에 구조를 설계하고 개선하는 플랫폼 엔지니어',
  about:
    '약 5년간 게임 서비스부터 엔터프라이즈 데이터 플랫폼까지 AWS 클라우드 인프라를 설계·구축·운영해왔습니다. Terraform/Terragrunt IaC와 EKS·ArgoCD GitOps로 멀티 계정·리전 인프라를 표준화했고, 최근에는 AWS Bedrock AgentCore 기반 AI Agent와 전사 AIOps 플랫폼을 직접 설계·개발하고 있습니다.',
  description:
    '5년차 DevOps · AI Platform Engineer의 프로젝트와 아키텍처 아카이브. Kubernetes(EKS), Terraform, ArgoCD GitOps, AWS, FinOps, AIOps/LLM.',
  // 공개해도 되는 링크만 선택적으로 채우세요. 비우면 표시되지 않습니다.
  links: {
    github: 'https://github.com/kyeongju',
    linkedin: 'https://www.linkedin.com/in/kyeongju-lee',
    email: 'kyeongju_lee@naver.com',
  },
};

export const NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Architecture', href: '/architecture' },
];

export const CERTS: { name: string; org: string; date: string }[] = [
  { name: 'AWS Solutions Architect – Professional', org: 'AWS', date: '2021.12' },
  { name: '정보처리기사', org: '한국산업인력공단', date: '2019.05' },
  { name: 'OCJP', org: 'Oracle', date: '2017.03' },
];

// 간략 이력 (직접적인 개인정보 없이 경력 타임라인만)
export const EXPERIENCE: { org: string; period: string; role: string; desc: string }[] = [
  {
    org: '교보 디플래닉스',
    period: '2024.06 – 재직 중',
    role: 'DevOps · Platform Engineer',
    desc: '그룹 데이터 통합 포털의 ~16개 AWS 계정 인프라를 Terragrunt/GitOps로 표준화하고, Bedrock AgentCore 기반 전사 AIOps 플랫폼을 직접 설계·개발.',
  },
  {
    org: '라인게임즈',
    period: '2020.12 – 2024.06',
    role: 'DevOps Engineer',
    desc: '4개 게임 타이틀의 AWS 인프라를 글로벌 런칭부터 서비스 종료까지 설계·구축·운영.',
  },
  {
    org: '아이소프트',
    period: '2019.08 – 2020.07',
    role: 'SI 사업부',
    desc: 'SI 사업 제안서 작성 및 기술 영업 지원.',
  },
];

export const SKILLS: { group: string; level: 'expert' | 'proficient'; items: string[] }[] = [
  { group: 'IaC', level: 'expert', items: ['Terraform', 'Terragrunt', 'Bash/Shell'] },
  { group: 'Container · Orchestration', level: 'expert', items: ['Kubernetes (EKS)', 'Docker', 'Helm', 'Kustomize', 'Karpenter', 'HPA'] },
  { group: 'CI/CD · GitOps', level: 'expert', items: ['ArgoCD', 'GitLab CI', 'Jenkins'] },
  { group: 'Cloud (AWS)', level: 'expert', items: ['EKS', 'Bedrock', 'AgentCore', 'Control Tower', 'Athena', 'Glue', 'KMS', 'DynamoDB'] },
  { group: 'AI · AIOps', level: 'proficient', items: ['Bedrock (Claude)', 'AgentCore', 'LangGraph', 'LangChain', 'MCP', 'Slack Bolt'] },
  { group: 'Observability', level: 'proficient', items: ['Prometheus', 'Thanos', 'Grafana', 'Loki', 'OpenSearch'] },
  { group: 'FinOps', level: 'proficient', items: ['Kubecost', 'Karpenter', 'Cost Explorer'] },
  { group: 'Backend · Frontend', level: 'proficient', items: ['Python', 'FastAPI', 'Flutter', 'MySQL'] },
  { group: 'Auth', level: 'proficient', items: ['Keycloak', 'Entra ID'] },
];

// 인터랙티브 아키텍처 (hskim-arch) — 홈·아키텍처 목록에서 공용
export const ARCHITECTURES: { href: string; title: string; summary: string; tags: string[] }[] = [
  {
    href: '/architecture/agentcore',
    title: 'AgentCore 멀티 에이전트',
    summary: 'Bedrock AgentCore 계층형 에이전트 — 오케스트레이션과 서브에이전트 구성을 인터랙티브 다이어그램으로.',
    tags: ['Bedrock AgentCore', 'Multi-Agent', 'A2A · AGUI'],
  },
  {
    href: '/architecture/terragrunt',
    title: '멀티 계정 Terragrunt + GitOps',
    summary: '실제 Terraform 구조 기반 — 계층형 Terragrunt 멀티 계정 IaC와 ArgoCD GitOps 배포.',
    tags: ['Terragrunt', 'Multi-Account', 'ArgoCD GitOps'],
  },
  {
    href: '/architecture/thanos',
    title: 'Thanos 중앙 집중 관측',
    summary: '다수 EKS 클러스터 메트릭을 중앙 집중 — 실시간/장기 보관 경로와 단일 Grafana 뷰.',
    tags: ['Thanos', 'Prometheus', 'Observability'],
  },
  {
    href: '/architecture/multi-region',
    title: '멀티리전 글로벌 게임 인프라',
    summary: '리전 복제 고가용성 + 실시간 로그 분석 — 글로벌 확장 패턴.',
    tags: ['Multi-Region', 'Terragrunt', 'OpenSearch'],
  },
];
