# CV Tailoring Agent — Architecture & Instructions

## What this project does
A web app (single HTML file, consistent with other apps in this repo) that:
1. Takes a base CV (stored in `base-cv.md`) and a base cover letter (`base-cover-letter.md`)
2. Searches for job offers via external APIs (no scraping, no ToS issues)
3. For each job: calls Claude API to tailor both the CV and cover letter to the specific offer
4. Presents the user with a review panel before any application action

## Multi-service API integration approach

### Why multiple services instead of one
No single API covers all job markets. We combine:
- **Adzuna API** (adzuna.com/api) — global jobs, free tier, well-documented, returns full job descriptions
- **Remotive API** (remotive.com/api/remote-jobs) — fully public, no key needed, remote/tech focus
- **Arbeitnow API** (arbeitnow.com/api) — EU + remote, open, no key needed

Each service is called in parallel, results are deduplicated by company+title, then ranked by relevance to the user's profile.

### Flow
```
User inputs: search criteria (role, location, remote, seniority)
      ↓
[Adzuna API] + [Remotive API] + [Arbeitnow API]  ← parallel fetch
      ↓
Deduplicate + rank by keyword match against base CV skills
      ↓
User sees list of N jobs → selects which to apply to
      ↓
For each selected job → Claude API call with:
  - system: role instructions (see prompt section below)
  - user: base CV + job description → returns tailored CV
  - user: base cover letter + job description → returns tailored letter
      ↓
User reviews both documents → downloads or copies
```

### Claude API usage in this project
- Model: `claude-haiku-4-5-20251001` for tailoring (fast + cheap, ~$0.80/MTok input)
- Model: `claude-sonnet-4-6` for complex rewrites if user requests deep tailoring
- Prompt caching: base CV and cover letter are sent as cached blocks (saves ~80% on repeated calls)
- No streaming needed — response arrives in 2-5 seconds

### Prompt structure for CV tailoring
```
SYSTEM:
You are an expert recruiter and resume writer. Your job is to tailor 
a candidate's CV to a specific job offer. Rules:
- Keep all facts true — never invent experience or skills
- Reorder and reword existing content to match job keywords
- Prioritize bullet points that align with the job requirements
- Keep the same overall structure and length
- Return only the final CV text, no commentary

USER:
=== BASE CV ===
{base_cv_content}

=== JOB OFFER ===
Title: {job_title}
Company: {company}
Description: {job_description}

Tailor the CV for this specific role.
```

### Prompt structure for cover letter tailoring
```
SYSTEM:
You are an expert at writing personalized cover letters. Rules:
- Use a professional but natural tone
- Reference the specific company and role by name
- Connect 2-3 specific experiences from the CV to the job requirements
- Keep it under 300 words
- Return only the letter text, no subject line or commentary

USER:
=== BASE COVER LETTER ===
{base_cover_letter_content}

=== JOB OFFER ===
Title: {job_title}
Company: {company}
Description: {job_description}

Write a tailored cover letter for this specific role.
```

## File structure
```
apps/cv-agent/
├── CLAUDE.md              ← this file (architecture + agent instructions)
├── base-cv.md             ← user's base CV (edit this with real info)
├── base-cover-letter.md   ← user's base cover letter template
└── index.html             ← the actual app (to be built)
```

## API keys needed
| Service | Where to get | Cost |
|---------|-------------|------|
| Claude API | console.anthropic.com | ~$0.50/mo for normal use |
| Adzuna | developer.adzuna.com | Free tier: 100 req/day |
| Remotive | remotive.com/api | Fully free, no key |
| Arbeitnow | arbeitnow.com/api | Fully free, no key |

API keys are stored in `localStorage` (user enters them once in settings). Never hardcoded.

## Tech stack
- **Frontend**: Single HTML file (same pattern as `finances.html` and `prompt-optimizer.html`)
- **No backend**: All API calls made directly from the browser
- **Claude API**: Called via `fetch` to `https://api.anthropic.com/v1/messages`
  - Requires `anthropic-dangerous-direct-browser-access: true` header (Anthropic allows this for personal tools)
- **Storage**: `localStorage` for API key, base CV, saved job results
- **Styling**: Same CSS variables and design system as other apps in the repo (`--bg`, `--surface`, `--primary`, etc.)

## Important implementation notes
- Adzuna requires CORS-friendly calls — their API supports it natively
- Remotive and Arbeitnow have open CORS headers — no proxy needed
- Claude API from browser requires the `anthropic-dangerous-direct-browser-access: true` header
- Base CV and cover letter should be read from localStorage (user pastes them in on first run)
- Prompt caching: send base CV as a `cache_control: {"type": "ephemeral"}` block to avoid re-billing it every call

## What this project does NOT do (intentionally)
- Auto-submit applications — user always reviews and applies manually
- Store CV data on any server — everything stays in the browser
- Use LinkedIn/Indeed scraping — ToS violation risk, fragile, not worth it

## Future phases (not built yet)
- Phase 3: Playwright script (separate Node.js tool, not in the HTML app) for LinkedIn Easy Apply automation
- ATS detection: identify which ATS the job uses (Greenhouse, Lever, Ashby) and generate ATS-optimized formatting
