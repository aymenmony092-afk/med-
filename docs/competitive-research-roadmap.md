# MED DZ — Competitive Research & Product Roadmap

Research snapshot: 2026-11-14  
Branch: `feature/med-dz-university-archives-ai-assistant`

> Competitor figures below are public, self-reported marketing claims or visible store metadata. They are not independently audited. MED DZ must not copy unverified numbers or present AI-generated questions as historical exams.

## 1. Competitor landscape

| Product | Publicly described strengths | User feedback / observed gap |
|---|---|---|
| NexaQuiz | Weekly free 100-question residency simulation; single exam timer; free navigation; ranking; detailed corrections; custom sessions; score by module; resume sessions; cross-device sync. Public site claims 58,000+ questions and 3,100 clinical cases. | Public beta page explicitly asks students to submit feedback. No sufficiently representative public review corpus was found in this research pass. |
| Résidy | Live classes, replay access, downloadable PDFs, QCM, flashcards with spaced repetition, teacher-led Telegram communities. | Testimonials praise detail and teaching quality; one candidate comment says the surgery session was difficult. Pricing shown publicly: 1,500 DZD/month per module or 4,000 DZD/month for a four-module pack. |
| Qcmology | QCM/QROC/cases, residency and externat annales, AI explanations, medical image analysis, PDF support, sync across devices. | A visible Play Store review praises organization; another complains that the free account is very limited. |
| MedSpaceDZ | Public site claims 100,000+ QCM, 1,200+ courses, mindmaps, flashcards, detailed corrections, and a large student community. | The product emphasizes breadth and a centralized study workspace. A representative public review sample was not found in this pass. |

### Public references

- NexaQuiz: https://nexaquiz.com/
- NexaQuiz about / feature claims: https://nexaquiz.com/about
- Résidy: https://www.residy.online/
- Résidy residency programme and pricing: https://www.residy.online/residanat
- Qcmology Google Play reviews: https://play.google.com/store/apps/details?id=com.qcmology
- Qcmology feature/help page: https://qcmology.net/help/passer-des-quiz
- MedSpaceDZ: https://app.medspacedz.com/

## 2. Product lessons

1. **A strong free entry point matters.** Do not make the free tier feel unusable. Offer a useful daily practice allowance and at least one complete free mock exam or public demo exam.
2. **Simulation quality is a core feature.** One continuous timer, free navigation, flagged questions, autosave, a clear final result, and a detailed post-exam correction.
3. **Retention needs a learning loop.** Mistake notebook, spaced repetition, flashcards, daily goals, and per-specialty performance.
4. **Students value human expertise.** Allow corrections and explanations to be reviewed by qualified contributors; show the reviewer and review date.
5. **Mobile and offline matter.** Preserve offline question access and local progress; add account-based sync only with a secure backend and conflict-safe merge.
6. **Trust is the differentiator MED DZ can own.** Every historical question must link to its exact source document, faculty, session year, page, and question number. Separate official corrections, expert-reviewed corrections, proposed corrections, and AI explanations.

## 3. MED DZ product positioning

**Positioning:** The Algerian medical study platform where students can practice offline, understand every mistake, and trace every historical exam question to its source.

Do not compete by claiming the largest question count. Compete on traceability, correction quality, learning analytics, and reliable offline use.

## 4. Release priorities

### P0 — Trust and correctness
- Keep the historical archive separate from the pedagogical practice bank and AI-generated practice.
- Enforce archive provenance: source URL, university, exam year, source document title, page, and question number.
- Label AI-generated references as proposed and unverified.
- Validate AI QCM output: exactly five non-empty choices, valid integer correct index, non-empty explanation.
- Add user reporting for wrong question text, answer key, explanation, or source.
- Track correction status and reviewer metadata before displaying a correction as verified.

### P1 — Exam experience
- Timed exam with one continuous countdown and navigation grid.
- Autosave answer changes and restore interrupted sessions.
- Result breakdown by specialty and difficulty.
- Review all answers after completion; distinguish unanswered, correct, and incorrect.
- Prevent duplicate progress counting when answers are changed or sessions are resumed.
- Add deterministic weekly mock-exam releases only after the backend can persist exam windows and results reliably.

### P2 — Learning loop
- Spaced repetition scheduling (again / difficult / good / easy).
- Daily target and streaks based on completed learning actions, not just app opens.
- Smart mistake notebook and targeted retesting.
- Personal performance trend by specialty and topic.
- Downloadable study packs and offline flashcards.

### P3 — Community and scale
- Secure user accounts and cross-device synchronization.
- Weekly leaderboard with anti-cheat controls and clear privacy settings.
- Student-reported corrections with moderation workflow.
- Contributor / faculty review dashboard.
- Teacher-reviewed live classes or recorded courses only after content partnerships are established.

## 5. Acceptance criteria

- No AI-generated item is ever classified as an original historical exam question.
- A historical question is not visible in the verified archive unless its source metadata is complete.
- Every displayed answer key has an explicit correction status.
- A timed session records each answered question once, including automatic timeout completion.
- Build and TypeScript validation pass before a release.
- Android install and smoke tests are performed before calling an APK ready.
- No PR is merged and no production deploy is claimed without explicit authorization and a successful deployment check.

## 6. Current verified engineering state

- The application has an offline IndexedDB data layer and a PWA shell.
- The current question files contain 132 pedagogical QCM entries (36 medical, 54 preclinical, 42 specialty questions); this is not a count of verified historical residency questions.
- The archive view requires provenance metadata before showing a question as verified.
- The AI QCM endpoint validates the five-choice format and marks AI-generated correction status as unverified.
- The home and residency dashboards now distinguish the practice bank from verified historical archives.
- GitHub Actions run 29 passed both `npm run build` and `npm run lint` on commit `a630685334db8ce8a1662eb65870ae21b1664b05`. A later run for subsequent copy changes was still running at the time of this note.
- No full Android device test has been completed in this research pass.
