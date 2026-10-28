export interface ResumeSampleTemplate {
  id: string;
  title: string;
  category: 'Executive & Leadership' | 'Software & Cloud' | 'AI & Data Science' | 'Finance & Consulting' | 'Product & Growth' | 'DevOps & SRE' | 'College Graduate';
  targetRole: string;
  seniority: 'Entry' | 'Mid-Level' | 'Senior' | 'Staff/Principal' | 'Executive (VP/C-Suite)';
  atsScore: number;
  highlight: string;
  unrejectableReason: string;
  rawHistory: string;
  sampleJD: string;
}

export type SampleResumeTemplate = ResumeSampleTemplate;

export const SAMPLE_TEMPLATES: ResumeSampleTemplate[] = [
  {
    id: 'harvard_classic',
    title: 'The Harvard & Ivy League Standard (Unrejectable Benchmark)',
    category: 'Finance & Consulting',
    targetRole: 'Senior Management Consultant / Strategy Lead',
    seniority: 'Senior',
    atsScore: 99.8,
    highlight: 'Ivy League Single-Column, ACR Framework, C-Suite Impact ($48M Value)',
    unrejectableReason: 'Follows the strict Harvard Business School & Wharton single-column hierarchy. 99.8% parse rate on Workday, Taleo, and Greenhouse with zero parsing traps.',
    rawHistory: `Name: Alexander Montgomery
Title: Senior Strategy & Management Consultant
Email: a.montgomery@alumni.harvard.edu | Phone: +1 (212) 555-0198 | LinkedIn: linkedin.com/in/amontgomery-strategy
Location: New York, NY / Remote

PROFESSIONAL SUMMARY:
High-impact Management Consultant with 7+ years delivering strategic transformations, operational restructuring, and post-merger integrations for Fortune 100 enterprises. Generated $48M+ in identified EBITDA expansion across 9 client engagements. Expert in financial modeling, cost rationalization, and C-suite stakeholder alignment.

EXPERIENCE:
Company: Global Strategy Partners | Senior Engagement Manager (2021 – Present)
- Led cross-functional advisory teams of 6–10 consultants on corporate turnarounds, delivering $32M in annualized cost savings across supply chain and procurement for a Fortune 50 industrial manufacturer.
- Restructured operational workflows across 14 manufacturing facilities, reducing cycle times by 35% and improving on-time fulfillment from 78% to 96%.
- Architected digital operating model for a $4.5B retail conglomerate, accelerating e-commerce throughput by 140% over 18 months.
- Authored 22 executive board memoranda and presented findings directly to C-suite leadership and audit committees.

Company: Apex Advisory Group | Management Consultant (2018 – 2021)
- Formulated zero-based budgeting (ZBB) program for commercial banking client, eliminating $16M in redundant vendor expenditures.
- Conducted commercial due diligence for private equity acquisitions totaling $1.4B in enterprise value.
- Modeled complex 5-year discounted cash flow (DCF) scenarios to evaluate capital allocation trade-offs.

EDUCATION:
- Master in Business Administration (MBA) | Harvard Business School | Baker Scholar (Top 5%)
- B.A. in Economics & Applied Mathematics | Columbia University | Magna Cum Laude

SKILLS & CORE COMPETENCIES:
- Strategic Planning: Post-Merger Integration (PMI), Zero-Based Budgeting (ZBB), Supply Chain Optimization, Operational Turnarounds
- Financial Modeling: DCF, LBO, Scenario Sensitivity Analysis, Cost Allocation, EBITDA Bridge Analysis
- Tools & Frameworks: Excel (VBA/Advanced Modeling), Tableau, Alteryx, ThinkCell, FactSet, Bloomberg`,
    sampleJD: `Senior Strategy & Management Consultant — Corporate Transformation
Responsibilities:
- Lead enterprise consulting workstreams advising Fortune 500 CEOs and boards on strategic turnaround and EBITDA expansion.
- Oversee complex financial modeling, operational diagnostics, and organizational restructuring initiatives.
- Guide client executives through organizational change management and digital capability development.
Requirements:
- 5+ years at top-tier management consultancy (McKinsey, BCG, Bain, Big 4 Strategy).
- Proven track record of delivering measurable cost optimization and revenue growth for enterprise clients.
- Deep mastery of financial modeling, executive presentations, and cross-functional leadership.`,
  },
  {
    id: 'silicon_valley_architect',
    title: 'Silicon Valley Principal Software Architect (FAANG Benchmark)',
    category: 'Software & Cloud',
    targetRole: 'Principal / Staff Distributed Systems Architect',
    seniority: 'Staff/Principal',
    atsScore: 99.5,
    highlight: 'Go, Kubernetes, Kafka, 45M Daily Requests, 64% Latency Drop',
    unrejectableReason: 'Adheres to the Google, Meta, and Apple engineering benchmark: quantified metrics on every bullet, zero corporate fluff, crisp technical stack matrix.',
    rawHistory: `Name: Aarav Patel
Title: Principal Distributed Systems Architect
Email: aarav.patel@techcorp.io | Phone: +1 (555) 234-5678 | GitHub: github.com/apatel-cloud
Location: San Francisco, CA / Remote

PROFESSIONAL SUMMARY:
Principal Systems Architect with 9+ years designing high-throughput, fault-tolerant distributed cloud architectures. Re-engineered core financial ingestion pipelines serving 45M+ daily requests with 99.99% availability. Deep mastery of Go, Kubernetes, Kafka, and zero-downtime multi-region deployments.

EXPERIENCE:
Company: Nexus Enterprise Cloud | Principal Infrastructure Architect (2022 – Present)
- Architected automated zero-downtime Blue/Green Kubernetes deployment pipeline across 8 multi-region clusters using ArgoCD and Terraform, increasing release cadence from bi-weekly to 24 deployments/day.
- Re-engineered core transaction ingestion pipeline with Apache Kafka and Go, reducing P99 latency by 64% and supporting sustained peaks of 22,000 TPS.
- Spearheaded company-wide cloud cost optimization initiative on AWS (EC2 Spot, Graviton3 instances, S3 lifecycle rules), slashing annual compute expenditures by $420,000.
- Mentored a distributed team of 14 senior engineers in site reliability engineering best practices and chaos engineering experiments.

Company: Apex FinTech Systems | Senior Software Engineer (2018 – 2022)
- Built distributed ledger processing services in Go and PostgreSQL, handling $1.2B in annualized transaction volume.
- Implemented real-time anomaly detection streaming worker pool using Redis Streams and gRPC microservices, flagging fraudulent transfers in sub-50ms.
- Achieved PCI-DSS Level 1 compliance through end-to-end payload encryption and IAM policy hardening.

EDUCATION:
- B.S. in Computer Science | First Class Honors | University of California, Berkeley

SKILLS & TECHNOLOGIES:
- Core Languages: Go, Python, TypeScript, SQL, C++, Bash
- Cloud & Infrastructure: AWS (EKS, RDS, S3, CloudFront), Google Cloud Platform, Kubernetes, Docker
- Architecture & Tools: Microservices, Apache Kafka, Redis, Terraform, ArgoCD, Prometheus, Grafana, gRPC`,
    sampleJD: `Staff / Principal Cloud Systems Architect — Distributed Platforms
Responsibilities:
- Lead the architectural vision and implementation of high-throughput microservices handling millions of events.
- Drive container orchestration across Kubernetes (EKS/GKE), Infrastructure as Code (Terraform), and CI/CD pipelines.
- Optimize systems for high availability (99.99%), low latency, and regulatory security compliance.
Requirements:
- 7+ years building enterprise distributed platforms in Go, Python, or Java.
- Proven expertise in Kubernetes, AWS, Apache Kafka, and Terraform.
- Track record of quantifiable latency reduction, reliability engineering, and cloud optimization.`,
  },
  {
    id: 'genai_ml_engineer',
    title: 'Senior AI / Machine Learning Engineer (LLMs & RAG)',
    category: 'AI & Data Science',
    targetRole: 'Senior Machine Learning & Generative AI Engineer',
    seniority: 'Senior',
    atsScore: 99.2,
    highlight: 'PyTorch, RAG Pipelines, LoRA Fine-Tuning, vLLM, Qdrant Vector DB',
    unrejectableReason: 'Optimized for high-demand AI/ML hiring algorithms with exact terminology matches across LLM architecture, vector search, inference acceleration, and model evaluation.',
    rawHistory: `Name: Sarah Jenkins
Title: Senior AI / Machine Learning Engineer
Email: s.jenkins@genai-labs.ai | Portfolio: sjenkins.dev | LinkedIn: linkedin.com/in/sjenkins-ai
Location: New York, NY / Remote

PROFESSIONAL SUMMARY:
Senior Machine Learning Engineer with 6+ years specializing in Large Language Models (LLMs), Retrieval-Augmented Generation (RAG) architectures, and production model serving. Designed enterprise semantic search engines reducing search abandonment by 42%.

EXPERIENCE:
Company: Cognitive AI Platforms | Senior GenAI Engineer (2022 – Present)
- Engineered hybrid semantic search and RAG knowledge retrieval engine utilizing PyTorch, LangChain, and Qdrant vector database, improving answer factual accuracy by 38% across 1.4M indexed enterprise documents.
- Fine-tuned transformer models using LoRA/PEFT on proprietary biomedical datasets, achieving an 8.2 point BLEU score gain over base open models.
- Deployed optimized inference pipelines with vLLM, TensorRT-LLM, and Triton Inference Server on Kubernetes GPU clusters, slashing token latency by 55% while doubling concurrency.
- Built automated evaluation harness measuring Perplexity, Burstiness, and Hallucination rates across 25,000 multi-turn test dialogues.

Company: DataPulse Analytics | Machine Learning Engineer (2019 – 2022)
- Developed computer vision convolutional neural networks for automated defect detection in industrial manufacturing, achieving 99.2% precision.
- Engineered automated data pipeline with Apache Airflow, Docker, and PostgreSQL processing 12TB of unstructured telemetry daily.

EDUCATION:
- M.S. in Artificial Intelligence & Robotics | Carnegie Mellon University
- B.S. in Electrical Engineering | University of Michigan

SKILLS:
- AI & Modeling: PyTorch, Hugging Face, Transformers, LLMs, LoRA, Vector Search (Qdrant, Pinecone), RAG
- Engineering & Serving: Python, C++, vLLM, Triton Server, Docker, Kubernetes, Ray, FastAPI
- MLOps & Data: MLflow, Weights & Biases, Apache Airflow, PostgreSQL, BigQuery`,
    sampleJD: `Senior Machine Learning Engineer — Generative AI & Retrieval
Responsibilities:
- Scale our GenAI intelligence layer, model inference pipelines, and vector retrieval systems.
- Fine-tune and evaluate open-weight LLMs using LoRA/PEFT for domain-specific applications.
- Optimize GPU memory throughput with vLLM, TensorRT-LLM, and Triton Inference Server.
Requirements:
- 5+ years hands-on ML engineering experience in Python and PyTorch.
- Deep expertise in LLM fine-tuning, RAG pipelines, and vector embeddings.
- Experience serving models at scale with vLLM or Triton.`,
  },
  {
    id: 'wall_street_finance',
    title: 'Investment Banking & Private Equity Analyst (Goldman Sachs Standard)',
    category: 'Finance & Consulting',
    targetRole: 'Investment Banking Associate / Private Equity Analyst',
    seniority: 'Mid-Level',
    atsScore: 99.4,
    highlight: '$1.8B+ Deal Volume, M&A Due Diligence, DCF/LBO Financial Modeling',
    unrejectableReason: 'Formatted strictly to Wall Street recruiting specifications. Clean financial metrics, transaction histories, and valuation methodologies tailored for banking ATS filters.',
    rawHistory: `Name: James Thornton, CFA
Title: Investment Banking Analyst — Mergers & Acquisitions
Email: j.thornton@nycapital.com | Phone: +1 (212) 555-8821 | LinkedIn: linkedin.com/in/jthornton-cfa
Location: New York, NY

PROFESSIONAL SUMMARY:
Investment Banking Professional with 4+ years executing M&A advisory, leveraged buyouts (LBO), and capital markets transactions totaling $1.8B in transaction value. CFA Charterholder with deep quantitative expertise in discounted cash flow (DCF), accretion/dilution, and trading comparables modeling.

EXPERIENCE:
Company: Apex Capital Partners | Investment Banking Analyst — TMT Group (2022 – Present)
- Executed 6 closed M&A transactions representing $1.8B in aggregate enterprise value across enterprise SaaS, cybersecurity, and fintech verticals.
- Built dynamic 3-statement financial models, LBO return analyses (IRR/MoIC), and DCF valuations used in live board presentations and client negotiations.
- Authored 35-page Confidential Information Memorandums (CIM) and managed virtual data rooms (VDR) during buy-side and sell-side due diligence.
- Led valuation benchmarking using precedent transactions and public trading comps for 20+ prospective transaction targets.

Company: Manhattan Valuation Advisory | Financial Valuation Associate (2020 – 2022)
- Prepared purchase price allocations (ASC 805) and intangible asset valuations for mid-market private equity acquisitions.
- Automated quarterly portfolio company valuation models via advanced Excel VBA macros, reducing processing time by 40%.

EDUCATION:
- B.S. in Finance & Statistics | Stern School of Business, New York University | Summa Cum Laude
- Chartered Financial Analyst (CFA) Charterholder | CFA Institute

TECHNICAL SKILLS & CERTIFICATIONS:
- Financial Analysis: LBO Modeling, DCF Analysis, M&A Accretion/Dilution, 3-Statement Forecasting, Comparable Company Analysis
- Software & Databases: Bloomberg Professional, FactSet, Capital IQ, PitchBook, Excel (VBA/Macros), PowerPoint`,
    sampleJD: `Investment Banking Associate — Mergers & Acquisitions (M&A)
Responsibilities:
- Manage the execution of live M&A transactions, capital raises, and strategic corporate advisory mandates.
- Build and audit complex financial models including LBO, DCF, and merger consequences.
- Supervise junior analysts in drafting CIMs, management presentations, and valuation decks.
Requirements:
- 3+ years experience in investment banking, corporate development, or private equity.
- Superior financial modeling and valuation skillset (DCF, LBO, Accretion/Dilution).
- Deep proficiency with Bloomberg, Capital IQ, and PitchBook.`,
  },
  {
    id: 'fullstack_swe',
    title: 'Senior Full-Stack Software Engineer (Modern React, Node & Cloud)',
    category: 'Software & Cloud',
    targetRole: 'Senior Full-Stack Software Engineer',
    seniority: 'Senior',
    atsScore: 99.1,
    highlight: 'React, Next.js, Node.js, GraphQL, PostgreSQL, +400k DAU',
    unrejectableReason: 'Employs crisp, high-signal engineering phrasing with comprehensive frontend, backend, and DevOps keywords that pass technical screeners with zero friction.',
    rawHistory: `Name: David Kim
Title: Senior Full-Stack Software Engineer
Email: david.kim@devmail.io | GitHub: github.com/dkim-dev | LinkedIn: linkedin.com/in/dkim-fullstack
Location: Seattle, WA / Remote

PROFESSIONAL SUMMARY:
Senior Full-Stack Engineer with 7+ years architecting scalable web applications, real-time collaboration engines, and resilient REST/GraphQL APIs. Scaled customer platforms from 50K to 400K daily active users (DAU) while maintaining 99.98% uptime.

EXPERIENCE:
Company: Aurora Cloud Systems | Senior Full-Stack Engineer (2021 – Present)
- Architected and shipped modular enterprise design system in React, TypeScript, and Tailwind CSS, increasing developer frontend velocity by 40% across 6 agile engineering teams.
- Replaced legacy REST endpoints with Apollo GraphQL gateway and DataLoader caching, reducing client network payload size by 52% and API response times by 38%.
- Built high-concurrency Node.js and TypeScript microservices backed by PostgreSQL and Redis, supporting 14,000 concurrent WebSocket connections.
- Implemented end-to-end automated testing with Playwright and Vitest, elevating critical-path code coverage from 68% to 94%.

Company: Velocity Digital | Full-Stack Developer (2018 – 2021)
- Developed responsive web applications for fintech clients using React, Next.js, and Express.
- Optimized relational database queries in PostgreSQL with indexed partitioning, eliminating slow queries (>100ms) on transaction tables.
- Built Docker containerized CI/CD build matrix in GitHub Actions, reducing deployment cycle times by 65%.

EDUCATION:
- B.S. in Computer Science | University of Washington

SKILLS:
- Frontend: React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Redux Toolkit, WebSockets
- Backend: Node.js, Express, NestJS, GraphQL, Python, RESTful APIs, Microservices
- Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, ECS, Lambda), Git`,
    sampleJD: `Senior Full Stack Software Engineer
Responsibilities:
- Build, scale, and maintain customer-facing web applications using React, TypeScript, and Node.js.
- Design performant APIs (GraphQL/REST) and optimize database schemas in PostgreSQL.
- Collaborate with product designers and backend engineers to deliver high-quality user experiences.
Requirements:
- 5+ years of full-stack web development experience.
- Strong proficiency in modern React, TypeScript, Node.js, and relational databases.
- Experience with CI/CD automation, cloud services (AWS), and automated testing.`,
  },
  {
    id: 'product_manager_plg',
    title: 'Lead Technical Product Manager (B2B SaaS & PLG Growth)',
    category: 'Product & Growth',
    targetRole: 'Director / Lead Technical Product Manager',
    seniority: 'Senior',
    atsScore: 98.9,
    highlight: '$18M ARR Roadmap, +28% Funnel Conversion, RICE Prioritization',
    unrejectableReason: 'Bridges business metrics (ARR, conversion, retention) with technical depth (APIs, microservices, data analytics) — the exact profile top hiring teams look for.',
    rawHistory: `Name: Priya Sharma
Title: Lead Technical Product Manager
Email: priya.sharma@saasproduct.com | LinkedIn: linkedin.com/in/priyasharma-pm
Location: Chicago, IL / Hybrid

PROFESSIONAL SUMMARY:
Technical Product Leader with 7+ years scaling enterprise B2B SaaS and Product-Led Growth (PLG) platforms. Owned end-to-end roadmap for workflow automation suite generating $18M ARR. Adept at translating complex distributed architectures into high-adoption user experiences.

EXPERIENCE:
Company: CloudScale SaaS | Lead Product Manager — Core Workflow (2022 – Present)
- Defined strategic roadmap and led 18-person cross-functional squad (Engineering, Design, Data) to deliver flagship AI-assisted workflow engine, driving $4.8M net-new ARR within 9 months of launch.
- Optimized user onboarding funnel through product-led experiments, increasing trial-to-paid conversion rate by 28% and boosting 30-day user retention by 34%.
- Spearheaded API Platform re-architecture, partnering with backend architects to publish developer SDKs adopted by 120+ enterprise integration partners.
- Conducted 60+ customer discovery interviews with VP-level stakeholders to prioritize enterprise security features (SSO, Audit Logs, RBAC).

Company: Velocity Workspaces | Senior Technical Product Manager (2019 – 2022)
- Spearheaded launch of real-time collaborative document editing, scaling daily active users (DAU) from 80K to 420K in 18 months.
- Implemented data-informed prioritization framework (RICE) across 4 engineering pods, reducing sprint spillover by 40%.

EDUCATION:
- B.Tech in Information Technology | Indian Institute of Technology (IIT) Delhi
- MBA in Technology Management | Kellogg School of Management

SKILLS:
- Product Strategy: Product-Led Growth (PLG), RICE Prioritization, Customer Discovery, OKR Alignment
- Technical Knowledge: REST APIs, SQL, Data Modeling, Microservices Architecture, Cloud Hosting
- Analytics & Tools: Mixpanel, Amplitude, Jira, Figma, Looker, Postman`,
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
    id: 'fresher_cs_unrejectable',
    title: 'Top College Graduate & Junior Software Engineer (Ivy / IIT Benchmark)',
    category: 'College Graduate',
    targetRole: 'Junior / Associate Software Engineer',
    seniority: 'Entry',
    atsScore: 98.6,
    highlight: 'GPA 3.86/4.0, Top 4% LeetCode, 2 Production Internships, Go/React Stack',
    unrejectableReason: 'Engineered specifically for campus and new-grad screening bots. Puts education, honors, competitive programming, and internship metrics in the primary optical zone.',
    rawHistory: `Name: Rohan Gupta
Title: Computer Science Graduate & Software Developer
Email: rohan.gupta@alumni.edu | GitHub: github.com/rohangupta-dev | LeetCode: leetcode.com/rgupta
Location: Austin, TX / Open to Relocation

EDUCATION:
- B.S. in Computer Science | University of Texas at Austin | GPA: 3.86/4.0 (2022 – 2026)
- Honors: Dean's Honor Roll (All Semesters), Top 4% LeetCode Globally (Contest Rating: 1980+)
- Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems, Computer Networks, Distributed Computing

EXPERIENCE:
Company: FastTrack Tech | Software Engineering Intern (Summer 2025)
- Developed responsive customer dashboard modules using React, TypeScript, and Tailwind CSS, improving mobile page load speed by 35%.
- Implemented secure JWT authentication and role-based access control (RBAC) across 12 RESTful API endpoints in Node.js and Express.
- Wrote automated unit and integration tests using Jest and React Testing Library, boosting test coverage from 62% to 88%.

Company: Innovate Labs | Frontend Developer Intern (Summer 2024)
- Built interactive data visualization charts with Chart.js and React, rendering 50,000+ real-time telemetry data points with zero frame drops.
- Collaborated with senior engineers using Git, GitHub PR reviews, and agile 2-week sprints.

ACADEMIC & OPEN-SOURCE PROJECTS:
Project: Distributed Task Queue & Real-time Chat Engine (2025)
- Designed an asynchronous job worker queue in Go and Redis with automatic worker heartbeat tracking and retry backoff.
- Engineered real-time messaging WebSocket server handling 1,000 concurrent sockets with sub-20ms message delivery.

SKILLS:
- Core Languages: Java, JavaScript, TypeScript, Python, C++, Go, SQL
- Frameworks & Libraries: React, Node.js, Express, Next.js, HTML5/CSS3, Tailwind CSS
- Developer Tools: Git, GitHub, Docker, Postman, Linux/Unix, MongoDB, PostgreSQL`,
    sampleJD: `Associate Software Engineer — New Graduate
Requirements:
- B.S. in Computer Science, Software Engineering, or related technical field.
- Proficiency in JavaScript/TypeScript, React, Node.js, and SQL.
- Solid understanding of object-oriented design, data structures, and algorithms.
- Passion for clean code, automated testing, and collaborative git workflows.`,
  },
  {
    id: 'devops_sre_lead',
    title: 'Senior DevOps & Site Reliability Engineer (99.99% Uptime)',
    category: 'DevOps & SRE',
    targetRole: 'Senior DevOps / SRE Infrastructure Engineer',
    seniority: 'Senior',
    atsScore: 99.1,
    highlight: 'Multi-Cloud Terraform, Kubernetes EKS/GKE, MTTR Cut by 70%, 99.99% SLA',
    unrejectableReason: 'Packed with essential infrastructure keywords (Kubernetes, Terraform, Prometheus, ArgoCD, MTTR) that cloud enterprise hiring systems scan for.',
    rawHistory: `Name: Marcus Vance
Title: Senior DevOps & Site Reliability Engineer
Email: m.vance@sre-systems.io | GitHub: github.com/mvance-ops
Location: Seattle, WA / Remote

PROFESSIONAL SUMMARY:
DevOps & Site Reliability Engineer with 7+ years of expertise in cloud automation, container orchestration, and telemetry. Cut Mean Time to Resolution (MTTR) by 70% across 60+ microservices through proactive Prometheus/Grafana alerting and automated canary rollouts.

EXPERIENCE:
Company: Global Commerce Cloud | Senior SRE Engineer (2021 – Present)
- Standardized multi-cloud infrastructure deployment with Terraform modules managing 240+ AWS and GCP resources with automated pull-request drift detection.
- Architected Kubernetes cluster autoscaling policies utilizing KEDA and Cluster Autoscaler, reducing idle compute waste by 32% during off-peak windows.
- Deployed distributed tracing and observability pipeline with OpenTelemetry, Jaeger, and Grafana Loki, diagnosing P99 API bottlenecks in minutes.
- Maintained 99.99% SLA across Black Friday / Cyber Week surges handling 4.2M orders with zero sev-1 incidents.

Company: Apex Data Cloud | Cloud Infrastructure Engineer (2018 – 2021)
- Migrated legacy on-premise monolithic workloads to containerized Docker environments on AWS ECS.
- Automated CI/CD build matrix using GitHub Actions, cutting build test execution time from 45 minutes to 11 minutes.

EDUCATION:
- B.S. in Computer Information Systems | University of Washington

SKILLS:
- Automation & IaC: Terraform, Ansible, CloudFormation, Helm
- Containers & Cloud: Kubernetes (EKS, GKE), Docker, AWS, Google Cloud Platform
- Monitoring & CI/CD: Prometheus, Grafana, Loki, OpenTelemetry, Datadog, GitHub Actions, ArgoCD`,
    sampleJD: `Senior Site Reliability Engineer (SRE)
Requirements:
- 5+ years supporting production cloud infrastructure in AWS or GCP.
- Deep expertise in Kubernetes, Docker, and Terraform IaC.
- Strong experience with observability stacks (Prometheus, Grafana, OpenTelemetry).
- Proven ability to reduce MTTR, build CI/CD automation, and enforce 99.99% SLAs.`,
  },
  {
    id: 'executive_vp_engineering',
    title: 'Executive VP of Engineering & Operations (C-Suite Standard)',
    category: 'Executive & Leadership',
    targetRole: 'VP / Director of Engineering',
    seniority: 'Executive (VP/C-Suite)',
    atsScore: 99.7,
    highlight: 'Scaled 12 to 85 Engineers, $35M Budget P&L, SOC 2 Type II, M&A Diligence',
    unrejectableReason: 'Positions senior leaders for board and executive search committees. Emphasizes organizational scaling, P&L stewardship, risk governance, and enterprise value.',
    rawHistory: `Name: Elena Rostova
Title: Vice President of Engineering
Email: elena.rostova@techleadership.com | LinkedIn: linkedin.com/in/erostova-exec
Location: San Francisco, CA

PROFESSIONAL SUMMARY:
Executive Engineering Leader with 14+ years scaling high-velocity engineering organizations from Series A through pre-IPO. Scaled team from 12 to 85+ engineers across 4 international hubs while managing a $35M annual operating budget. Reduced enterprise customer churn by 35% through resilient architectural refactoring.

EXPERIENCE:
Company: ScalePoint Enterprise | Vice President of Engineering (2021 – Present)
- Built and led global engineering team of 85+ engineers, directors, and product managers across US, Europe, and Asia, improving sprint velocity by 55% while maintaining eNPS of +64.
- Managed $35M departmental budget across cloud infrastructure, developer tooling, and compensation.
- Led technical due diligence and system consolidation for 2 strategic acquisitions totaling $74M, achieving full platform interoperability in 120 days.
- Spearheaded executive security & SOC 2 Type II certification, unlocking $22M in enterprise pipeline contracts with Fortune 500 financial clients.

Company: DataVanguard | Director of Engineering (2017 – 2021)
- Grew engineering org from 18 to 52 engineers across 6 pods.
- Re-architected core legacy billing engine to cloud-native microservices, increasing transaction capacity by 500%.

EDUCATION:
- M.S. in Management Science & Engineering | Stanford University
- B.S. in Computer Science & Applied Mathematics | UC Berkeley

SKILLS & EXECUTIVE LEADERSHIP:
- Leadership: Organizational Scaling, Executive Hiring, P&L Budget Management, Strategic Roadmaps, M&A Diligence
- Governance & Compliance: SOC 2 Type II, ISO 27001, GDPR Compliance, Agile Transformation
- Architecture: Enterprise SaaS, Distributed Microservices, Multi-Cloud Strategy`,
    sampleJD: `Vice President of Engineering
Requirements:
- 10+ years engineering experience with 5+ years in senior leadership (Director/VP).
- Experience managing multi-million dollar operating budgets (P&L) and scaling teams past 60+ engineers.
- Proven experience with enterprise compliance (SOC 2, ISO 27001) and executive stakeholder alignment.`,
  },
  {
    id: 'cybersecurity_architect',
    title: 'Lead Cybersecurity & Cloud Security Architect (Zero Trust)',
    category: 'Software & Cloud',
    targetRole: 'Lead Security Architect / Head of Information Security',
    seniority: 'Senior',
    atsScore: 99.0,
    highlight: 'Zero Trust IAM, SOC 2 Type II, CISSP, Threat Modeling, +95% Vulnerability Reduction',
    unrejectableReason: 'Loaded with mandatory compliance standards (SOC 2, ISO 27001, NIST) and technical defense mechanisms that corporate security recruiters strictly query for.',
    rawHistory: `Name: Nathan Cross, CISSP, CISM
Title: Lead Cloud & Cybersecurity Architect
Email: n.cross@infosec-arch.io | LinkedIn: linkedin.com/in/ncross-cyber
Location: Washington, DC / Remote

PROFESSIONAL SUMMARY:
Cybersecurity Architect with 8+ years designing Zero-Trust cloud infrastructures, automated SecOps pipelines, and threat modeling frameworks for regulated financial and defense platforms. Mitigated 95% of critical CVE vulnerabilities within 24-hour SLAs.

EXPERIENCE:
Company: Fortified Defense Cloud | Lead Security Architect (2021 – Present)
- Architected enterprise-wide Zero-Trust access perimeter across AWS and hybrid on-premise environments using Okta, HashiCorp Vault, and mutual TLS.
- Led technical execution for SOC 2 Type II, ISO 27001, and FedRAMP Moderate compliance certifications with zero non-conformity findings.
- Implemented automated infrastructure vulnerability scanning and container image scanning in CI/CD (Trivy, Snyk), catching 450+ security regressions pre-production.
- Directed incident response team during live red-team adversary simulations, reducing mean time to detect (MTTD) from 4 hours to 12 minutes.

Company: Aegis Cyber Systems | Senior Security Engineer (2018 – 2021)
- Engineered automated AWS IAM privilege boundary enforcement scripts in Python, eliminating 1,200+ over-permissive wildcard roles.
- Deployed centralized SIEM telemetry pipeline ingesting 85M daily events into Splunk and AWS GuardDuty.

EDUCATION:
- M.S. in Cybersecurity & Information Assurance | Johns Hopkins University
- B.S. in Network Security | Purdue University

CERTIFICATIONS:
- Certified Information Systems Security Professional (CISSP)
- Certified Information Security Manager (CISM)
- AWS Certified Security – Specialty`,
    sampleJD: `Lead Cloud Security Architect
Responsibilities:
- Drive the enterprise Zero-Trust security architecture across cloud platforms (AWS/GCP).
- Oversee compliance roadmaps for SOC 2 Type II, ISO 27001, and NIST 800-53 frameworks.
- Partner with DevOps to build automated container and code scanning into CI/CD.
Requirements:
- 6+ years in information security, cloud architecture, or SecOps.
- Active CISSP, CISM, or equivalent security certifications.
- Strong hands-on experience with AWS security tooling, SIEM, and vulnerability remediation.`,
  },
  {
    id: 'digital_marketing_growth',
    title: 'Director of Growth Marketing & Demand Generation',
    category: 'Product & Growth',
    targetRole: 'Director of Growth & Performance Marketing',
    seniority: 'Senior',
    atsScore: 98.8,
    highlight: '$4.2M Paid Media, -42% CAC, +210% Pipeline Generated, Multi-Touch Attribution',
    unrejectableReason: 'Demonstrates undeniable commercial ROI on every line item: specific spend budgets, CAC reduction, pipeline acceleration, and conversion metrics.',
    rawHistory: `Name: Rachel Bennett
Title: Director of Growth & Demand Generation
Email: rachel.bennett@growthmarketer.com | LinkedIn: linkedin.com/in/rbennett-growth
Location: Boston, MA / Remote

PROFESSIONAL SUMMARY:
Data-driven Growth Marketing Leader with 8+ years scaling multi-channel demand generation, paid acquisition, and conversion rate optimization (CRO) for B2B SaaS. Managed $4.2M annual media budget while cutting Customer Acquisition Cost (CAC) by 42%.

EXPERIENCE:
Company: Elevate SaaS | Director of Growth Marketing (2022 – Present)
- Managed $4.2M annual performance marketing budget across Google Ads, LinkedIn Ads, Meta, and Programmatic, generating $16.4M in qualified enterprise sales pipeline.
- Scaled organic search traffic from 45K to 320K monthly visits through programmatic SEO landing pages and content cluster architecture.
- Optimized landing page conversion rates by 64% through 40+ rigorous A/B experiments on messaging, social proof, and multi-step lead forms.
- Implemented multi-touch marketing attribution model in HubSpot and Snowflake, providing executive visibility into channel-by-channel LTV/CAC ratios.

Company: Vanguard Media | Senior Demand Generation Manager (2019 – 2022)
- Led B2B account-based marketing (ABM) campaigns targeting Fortune 1000 accounts, achieving a 34% meeting-booked rate.
- Automated email nurture drip sequences in Marketo, boosting marketing qualified lead (MQL) velocity by 45%.

EDUCATION:
- B.A. in Marketing & Communications | Boston University | Cum Laude

SKILLS & PLATFORMS:
- Acquisition: Paid Search (Google Ads), Paid Social (LinkedIn/Meta), Programmatic SEO, ABM (6sense/Demandbase)
- Analytics & Attribution: Google Analytics 4, HubSpot, Marketo, Snowflake, Segment, Tableau
- Optimization: Conversion Rate Optimization (CRO), VWO, Optimizely, SQL, Messaging Strategy`,
    sampleJD: `Director of Growth Marketing
Responsibilities:
- Own the performance marketing strategy, budget allocation ($3M+), and pipeline generation goals.
- Scale multi-channel paid acquisition across search, social, and programmatic display.
- Partner with product and sales to optimize the customer conversion journey and reduce CAC.
Requirements:
- 6+ years in growth marketing or demand generation in B2B SaaS.
- Proven track record of managing multi-million dollar ad budgets and cutting CAC.
- Deep expertise in GA4, HubSpot/Marketo, and marketing attribution modeling.`,
  },
  {
    id: 'healthcare_operations',
    title: 'Healthcare Clinical Operations & Hospital Administrator',
    category: 'Executive & Leadership',
    targetRole: 'Director of Clinical Operations / Healthcare Administrator',
    seniority: 'Senior',
    atsScore: 98.7,
    highlight: '450-Bed Facility, HIPAA Compliance, +32% Patient Throughput, Epic EHR',
    unrejectableReason: 'Strictly aligned with healthcare provider ATS requirements, featuring regulatory standards (HIPAA, JCAHO), EHR systems (Epic/Cerner), and clinical throughput metrics.',
    rawHistory: `Name: Dr. Marcus Holloway, MHA
Title: Director of Clinical Operations
Email: m.holloway@healthsystems.org | LinkedIn: linkedin.com/in/mholloway-mha
Location: Philadelphia, PA

PROFESSIONAL SUMMARY:
Healthcare Operations Executive with 10+ years directing inpatient and outpatient operations across 450-bed tertiary care hospital systems. Elevated patient throughput by 32% while sustaining 99.4% regulatory compliance across Joint Commission (JCAHO) and HIPAA audits.

EXPERIENCE:
Company: Keystone Health System | Director of Hospital Operations (2021 – Present)
- Directed operational workflow, departmental budget ($28M), and clinical staffing across 12 inpatient care units comprising 450 beds and 220 healthcare personnel.
- Decreased emergency department (ED) wait times by 40 minutes through lean bed-management protocols and predictive patient discharge scheduling in Epic EHR.
- Achieved zero penalty findings during comprehensive Joint Commission (JCAHO) triennial accreditation survey.
- Led hospital-wide clinical supply chain rationalization, reducing medical inventory holding costs by $1.8M annually.

Company: Metro Health Alliance | Clinical Operations Manager (2016 – 2021)
- Managed surgical suite turnover scheduling across 14 operating rooms, increasing daily surgical case volume by 22%.
- Standardized nursing handoff protocols, reducing medication administration discrepancies by 48%.

EDUCATION:
- Master of Health Administration (MHA) | Johns Hopkins Bloomberg School of Public Health
- B.S. in Nursing (RN) | University of Pennsylvania

CERTIFICATIONS & SYSTEMS:
- Certified Healthcare Financial Professional (CHFP) | HFMA
- EHR Platforms: Epic Systems (Certified Physician Builder), Cerner Millennium
- Regulatory Knowledge: HIPAA Security Rule, JCAHO Accreditation, CMS Quality Measures, Lean Six Sigma Green Belt`,
    sampleJD: `Director of Clinical Hospital Operations
Responsibilities:
- Oversee day-to-day inpatient hospital operations, patient flow, and clinical resource allocation.
- Ensure strict regulatory compliance with Joint Commission, CMS, and HIPAA guidelines.
- Partner with physician leaders to improve patient outcomes, bed turnover, and operating efficiency.
Requirements:
- 7+ years of progressive healthcare management experience in an acute care setting.
- Master's degree in Health Administration (MHA), Healthcare Management, or MBA.
- Extensive experience with Epic EHR and Lean Six Sigma methodologies.`,
  },
];
