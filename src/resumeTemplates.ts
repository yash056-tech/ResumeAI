export interface ResumeSampleTemplate {
  id: string;
  title: string;
  category: 'Software & Cloud' | 'AI & Data Science' | 'Product & Growth' | 'DevOps & SRE' | 'College Graduate' | 'Operations & Leadership';
  targetRole: string;
  seniority: 'Entry' | 'Mid-Level' | 'Senior' | 'Staff/Principal' | 'Executive (VP/C-Suite)';
  atsScore: number;
  highlight: string;
  rawHistory: string;
  sampleJD: string;
}

export type SampleResumeTemplate = ResumeSampleTemplate;

export const SAMPLE_TEMPLATES: ResumeSampleTemplate[] = [
  {
    id: 'cloud_architect',
    title: 'Senior Cloud & Distributed Systems Architect',
    category: 'Software & Cloud',
    targetRole: 'Staff / Principal Cloud Architect',
    seniority: 'Staff/Principal',
    atsScore: 99,
    highlight: 'Kafka, Kubernetes, Go, Zero-Downtime Migration (64% latency drop)',
    rawHistory: `Name: Aarav Patel
Title: Senior Cloud & Infrastructure Architect
Email: aarav.patel@techcorp.io | Phone: +1 (555) 234-5678 | GitHub: github.com/apatel-cloud
Location: San Francisco, CA / Remote

SUMMARY:
Results-oriented Cloud Infrastructure & Systems Architect with 8+ years designing high-throughput, fault-tolerant distributed platforms. Led modernization of microservices serving 45M+ daily requests with 99.99% availability. Expert in Go, Kubernetes, Terraform, AWS, and event-driven architectures.

EXPERIENCE:
Company: Nexus Enterprise Cloud | Senior Staff Infrastructure Engineer (2022 - Present)
- Architected automated zero-downtime Blue/Green Kubernetes deployment pipeline across 8 multi-region clusters using ArgoCD and Terraform, increasing release cadence from bi-weekly to 24 deployments/day.
- Re-engineered core financial transaction ingestion pipeline with Apache Kafka and Go, reducing P99 latency by 64% and supporting sustained peaks of 18,000 TPS.
- Spearheaded company-wide cloud cost optimization initiative on AWS (EC2 Spot, Graviton3 instances, S3 lifecycle rules), slashing annual compute expenditures by $420,000.
- Mentored a distributed team of 14 senior engineers in site reliability engineering best practices and chaos engineering experiments.

Company: Apex FinTech Systems | Senior Software Engineer (2019 - 2022)
- Built distributed ledger processing services in Go and PostgreSQL, handling $1.2B in annualized transaction volume.
- Implemented real-time anomaly detection streaming worker pool using Redis Streams and gRPC microservices.
- Achieved PCI-DSS Level 1 compliance through end-to-end payload encryption and IAM policy hardening.

SKILLS:
- Languages: Go, Python, TypeScript, SQL, Bash
- Cloud & Platforms: AWS (EKS, RDS, S3, CloudFront), Google Cloud, Kubernetes, Docker
- Architecture & Tools: Microservices, Apache Kafka, Redis, Terraform, ArgoCD, Prometheus, Grafana

EDUCATION:
- B.S. in Computer Science | First Class Honors | University of California, Berkeley`,
    sampleJD: `Staff Cloud Systems Architect — Next-Gen Distributed Platforms
Responsibilities:
- Lead the architecture and evolution of high-throughput microservices handling millions of events.
- Drive container orchestration across Kubernetes (EKS/GKE), Infrastructure as Code (Terraform), and CI/CD pipelines.
- Optimize systems for high availability (99.99%), low latency, and security compliance.
- Mentor senior engineers and collaborate with product engineering teams.
Requirements:
- 7+ years building enterprise distributed systems in Go, Python, or Java.
- Proven expertise in Kubernetes, AWS, Apache Kafka, and Terraform.
- Track record of quantifiable latency reduction, reliability engineering, and cloud optimization.`,
  },
  {
    id: 'ai_engineer',
    title: 'AI / Machine Learning Engineer (LLMs & Vision)',
    category: 'AI & Data Science',
    targetRole: 'Senior Machine Learning & GenAI Engineer',
    seniority: 'Senior',
    atsScore: 98,
    highlight: 'PyTorch, Gemini API, RAG Pipelines, Vector Search, TensorRT',
    rawHistory: `Name: Sarah Jenkins
Title: Senior AI / Machine Learning Engineer
Email: s.jenkins@genai-labs.ai | Portfolio: sjenkins.dev | LinkedIn: linkedin.com/in/sjenkins-ai
Location: New York, NY / Remote

SUMMARY:
Senior Machine Learning Engineer with 6+ years specializing in Large Language Models (LLMs), Retrieval-Augmented Generation (RAG) architectures, and production model serving. Designed enterprise semantic search engines reducing search abandonment by 42%.

EXPERIENCE:
Company: Cognitive AI Platforms | Senior GenAI Engineer (2022 - Present)
- Engineered hybrid semantic search and RAG knowledge retrieval engine utilizing PyTorch, LangChain, and Qdrant vector database, improving answer factual accuracy by 38% across 1.4M indexed enterprise documents.
- Fine-tuned transformer models using LoRA/PEFT on proprietary biomedical datasets, achieving an 8.2 point BLEU score gain over base open models.
- Deployed optimized inference pipelines with vLLM, TensorRT-LLM, and Triton Inference Server on Kubernetes GPU clusters, slashing token latency by 55% while doubling concurrency.
- Built automated evaluation harness measuring Perplexity, Burstiness, and Hallucination rates across 25,000 multi-turn test dialogues.

Company: DataPulse Analytics | Machine Learning Engineer (2019 - 2022)
- Developed computer vision convolutional neural networks for automated defect detection in industrial manufacturing, achieving 99.2% precision.
- Engineered automated data pipeline with Apache Airflow, Docker, and PostgreSQL processing 12TB of unstructured telemetry daily.

SKILLS:
- AI & Modeling: PyTorch, Hugging Face, Transformers, LLMs, LoRA, Vector Search (Qdrant, Pinecone), RAG
- Engineering & Serving: Python, C++, vLLM, Triton Server, Docker, Kubernetes, Ray, FastAPI
- MLOps & Data: MLflow, Weights & Biases, Apache Airflow, PostgreSQL, BigQuery

EDUCATION:
- M.S. in Artificial Intelligence & Robotics | Carnegie Mellon University
- B.S. in Electrical Engineering | University of Michigan`,
    sampleJD: `Senior Machine Learning Engineer — Generative AI & Retrieval
We are looking for a Senior AI/ML Engineer to scale our GenAI intelligence layer.
Requirements:
- 5+ years of hands-on ML engineering experience in Python and PyTorch.
- Deep expertise in LLM fine-tuning (LoRA), Retrieval-Augmented Generation (RAG), and vector embeddings.
- Experience serving models at scale with vLLM, Triton, or TensorRT.
- Familiarity with MLOps frameworks, GPU orchestration, and latency profiling.`,
  },
  {
    id: 'product_manager',
    title: 'Lead Technical Product Manager (B2B SaaS)',
    category: 'Product & Growth',
    targetRole: 'Director / Lead Technical Product Manager',
    seniority: 'Senior',
    atsScore: 97,
    highlight: '0 to 1 Product Launches, PLG Growth (+135% ARR), Agile Roadmap',
    rawHistory: `Name: Priya Sharma
Title: Lead Technical Product Manager
Email: priya.sharma@saasproduct.com | LinkedIn: linkedin.com/in/priyasharma-pm
Location: Chicago, IL / Hybrid

SUMMARY:
Technical Product Leader with 7+ years scaling enterprise B2B SaaS and Product-Led Growth (PLG) platforms. Owned end-to-end roadmap for workflow automation suite generating $18M ARR. Adept at translating complex distributed architectures into high-adoption user experiences.

EXPERIENCE:
Company: CloudScale SaaS | Lead Product Manager — Core Workflow (2022 - Present)
- Defined strategic roadmap and led 18-person cross-functional squad (Engineering, Design, Data) to deliver flagship AI-assisted workflow engine, driving $4.8M net-new ARR within 9 months of launch.
- Optimized user onboarding funnel through product-led experiments, increasing trial-to-paid conversion rate by 28% and boosting 30-day user retention by 34%.
- Spearheaded API Platform re-architecture, partnering with backend architects to publish developer SDKs adopted by 120+ enterprise integration partners.
- Conducted 60+ customer discovery interviews with VP-level stakeholders to prioritize enterprise security features (SSO, Audit Logs, RBAC).

Company: Velocity Workspaces | Senior Technical Product Manager (2019 - 2022)
- Spearheaded launch of real-time collaborative document editing, scaling daily active users (DAU) from 80K to 420K in 18 months.
- Implemented data-informed prioritization framework (RICE) across 4 engineering pods, reducing sprint spillover by 40%.

SKILLS:
- Product Strategy: Product-Led Growth (PLG), RICE Prioritization, Customer Discovery, OKR Alignment
- Technical Knowledge: REST APIs, SQL, Data Modeling, Microservices Architecture, Cloud Hosting
- Analytics & Tools: Mixpanel, Amplitude, Jira, Figma, Looker, Postman

EDUCATION:
- B.Tech in Information Technology | Indian Institute of Technology (IIT) Delhi
- MBA in Technology Management | Kellogg School of Management`,
    sampleJD: `Lead Technical Product Manager — Enterprise SaaS
Responsibilities:
- Drive product vision, strategy, and execution for high-growth developer and workflow platforms.
- Partner with engineering leads to architect scalable developer APIs and integrations.
- Leverage product analytics (Amplitude, SQL) to measure conversion, engagement, and retention.
Requirements:
- 6+ years of technical product management experience in B2B SaaS or cloud platforms.
- Strong ability to dive into API schemas, architecture diagrams, and user data.
- Demonstrated track record of accelerating revenue growth, ARR, and customer retention.`,
  },
  {
    id: 'fresher_cs',
    title: 'College Graduate / Junior Software Engineer',
    category: 'College Graduate',
    targetRole: 'Junior / Associate Software Engineer',
    seniority: 'Entry',
    atsScore: 96,
    highlight: 'Full-Stack React/Node, Competitive Programming, 2 Production Internships',
    rawHistory: `Name: Rohan Gupta
Title: Computer Science Graduate & Software Developer
Email: rohan.gupta@alumni.edu | GitHub: github.com/rohangupta-dev | LeetCode: leetcode.com/rgupta
Location: Austin, TX / Open to Relocation

SUMMARY:
High-achieving Computer Science Graduate with a strong foundation in Data Structures, Algorithms, and Full-Stack Web Development. Built production React/Node applications processing 10,000+ monthly visits during two software engineering internships. Ranked Top 4% on LeetCode (Rating: 1980+).

EXPERIENCE:
Company: FastTrack Tech | Software Engineering Intern (Summer 2025)
- Developed responsive customer dashboard modules using React, TypeScript, and Tailwind CSS, improving mobile page load speed by 35%.
- Implemented secure JWT authentication and role-based access control (RBAC) across 12 RESTful API endpoints in Node.js and Express.
- Wrote automated unit and integration tests using Jest and React Testing Library, boosting test coverage from 62% to 88%.

Company: Innovate Labs | Frontend Developer Intern (Summer 2024)
- Built interactive data visualization charts with Chart.js and React, rendering 50,000+ real-time telemetry data points with zero frame drops.
- Collaborated with senior engineers using Git, GitHub PR reviews, and agile 2-week sprints.

ACADEMIC PROJECTS:
Project: Distributed Task Queue & Real-time Chat Engine (2025)
- Designed an asynchronous job worker queue in Go and Redis with automatic worker heartbeat tracking and retry backoff.
- Engineered real-time messaging WebSocket server handling 1,000 concurrent sockets with sub-20ms message delivery.

SKILLS:
- Core Languages: Java, JavaScript, TypeScript, Python, C++, SQL
- Frameworks & Libraries: React, Node.js, Express, Next.js, HTML5/CSS3
- Developer Tools: Git, GitHub, Docker, Postman, Linux/Unix, MongoDB, PostgreSQL

EDUCATION:
- B.S. in Computer Science | GPA: 3.86/4.0 | Dean's Honor Roll (2022 - 2026)`,
    sampleJD: `Associate Software Engineer — Full-Stack
Looking for driven early-career software engineers to build customer-facing web applications.
Requirements:
- B.S. in Computer Science, Software Engineering, or related field.
- Proficiency in JavaScript/TypeScript, React, Node.js, and SQL.
- Solid understanding of object-oriented design, data structures, and algorithms.
- Passion for clean code, automated testing, and collaborative git workflows.`,
  },
  {
    id: 'devops_sre',
    title: 'DevOps & Site Reliability Engineer (SRE)',
    category: 'DevOps & SRE',
    targetRole: 'Senior DevOps / SRE Engineer',
    seniority: 'Senior',
    atsScore: 98,
    highlight: 'Terraform, Kubernetes, CI/CD, 99.99% Uptime, MTTR reduction by 70%',
    rawHistory: `Name: Marcus Vance
Title: Senior DevOps & Site Reliability Engineer
Email: m.vance@sre-systems.io | GitHub: github.com/mvance-ops
Location: Seattle, WA / Remote

SUMMARY:
DevOps & Site Reliability Engineer with 7+ years of expertise in cloud automation, container orchestration, and telemetry. Cut Mean Time to Resolution (MTTR) by 70% across 60+ microservices through proactive Prometheus/Grafana alerting and automated canary rollouts.

EXPERIENCE:
Company: Global Commerce Cloud | Senior SRE Engineer (2021 - Present)
- Standardized multi-cloud infrastructure deployment with Terraform modules managing 240+ AWS and GCP resources with automated pull-request drift detection.
- Architected Kubernetes cluster autoscaling policies utilizing KEDA and Cluster Autoscaler, reducing idle compute waste by 32% during off-peak windows.
- Deployed distributed tracing and observability pipeline with OpenTelemetry, Jaeger, and Grafana Loki, diagnosing P99 API bottlenecks in minutes.
- Maintained 99.99% SLA across Black Friday / Cyber Week surges handling 4.2M orders with zero sev-1 incidents.

Company: Apex Data Cloud | Cloud Infrastructure Engineer (2018 - 2021)
- Migrated legacy on-premise monolithic workloads to containerized Docker environments on AWS ECS.
- Automated CI/CD build matrix using GitHub Actions, cutting build test execution time from 45 minutes to 11 minutes.

SKILLS:
- Automation & IaC: Terraform, Ansible, CloudFormation, Helm
- Containers & Cloud: Kubernetes (EKS, GKE), Docker, AWS, Google Cloud Platform
- Monitoring & CI/CD: Prometheus, Grafana, Loki, OpenTelemetry, Datadog, GitHub Actions, ArgoCD

EDUCATION:
- B.S. in Computer Information Systems | University of Washington`,
    sampleJD: `Senior Site Reliability Engineer (SRE)
Requirements:
- 5+ years supporting production cloud infrastructure in AWS or GCP.
- Deep expertise in Kubernetes, Docker, and Terraform IaC.
- Strong experience with observability stacks (Prometheus, Grafana, OpenTelemetry).
- Proven ability to reduce MTTR, build CI/CD automation, and enforce 99.99% SLAs.`,
  },
  {
    id: 'executive_director',
    title: 'VP of Engineering & Technology Operations',
    category: 'Operations & Leadership',
    targetRole: 'VP / Director of Engineering',
    seniority: 'Executive (VP/C-Suite)',
    atsScore: 99,
    highlight: 'Scaled 12 to 85 engineers, $35M P&L, C-Suite ACR Leadership',
    rawHistory: `Name: Elena Rostova
Title: Vice President of Engineering
Email: elena.rostova@techleadership.com | LinkedIn: linkedin.com/in/erostova-exec
Location: San Francisco, CA

SUMMARY:
Executive Engineering Leader with 14+ years scaling high-velocity engineering organizations from Series A through pre-IPO. Scaled team from 12 to 85+ engineers across 4 international hubs while managing a $35M annual operating budget. Reduced enterprise customer churn by 35% through resilient architectural refactoring.

EXPERIENCE:
Company: ScalePoint Enterprise | Vice President of Engineering (2021 - Present)
- Built and led global engineering team of 85+ engineers, directors, and product managers across US, Europe, and Asia, improving sprint velocity by 55% while maintaining eNPS of +64.
- Managed $35M departmental budget across cloud infrastructure, developer tooling, and compensation.
- Led technical due diligence and system consolidation for 2 strategic acquisitions totaling $74M, achieving full platform interoperability in 120 days.
- Spearheaded executive security & SOC 2 Type II certification, unlocking $22M in enterprise pipeline contracts with Fortune 500 financial clients.

Company: DataVanguard | Director of Engineering (2017 - 2021)
- Grew engineering org from 18 to 52 engineers across 6 pods.
- Re-architected core legacy billing engine to cloud-native microservices, increasing transaction capacity by 500%.

SKILLS:
- Leadership: Organizational Scaling, Executive Hiring, P&L Budget Management, Strategic Roadmaps, M&A Diligence
- Governance: SOC 2 Type II, ISO 27001, GDPR Compliance, Agile Transformation
- Architecture: Enterprise SaaS, Distributed Microservices, Multi-Cloud Strategy

EDUCATION:
- M.S. in Management Science & Engineering | Stanford University
- B.S. in Computer Science & Applied Mathematics | UC Berkeley`,
    sampleJD: `Vice President of Engineering
Looking for an executive engineering leader to lead product engineering, platform infrastructure, and organizational culture.
Requirements:
- 10+ years engineering experience with 5+ years in senior leadership (Director/VP).
- Experience managing multi-million dollar operating budgets (P&L) and scaling teams past 60+ engineers.
- Proven experience with enterprise compliance (SOC 2, ISO 27001) and executive stakeholder alignment.`,
  },
];
