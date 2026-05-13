# Lumo Task — Product Requirements Document

> Version: v1.0  
> Status: Design-Ready  
> Scope: Phase 1 MVP — UI/UX Design Input  
> Last Updated: 2026-05-13

---

## 1. Product Vision

Lumo Task is a **local-first AI execution partner** for desktop. It does not merely record tasks — it synthesizes tasks, memory, user preferences, and focus state to actively surface the single most important thing to do right now, then transitions the user directly into focused execution.

**One-line positioning:**  
> An AI Focus OS that remembers you, understands context, and pulls you into deep work.

**Design north star:**  
> Within 10 seconds of opening Lumo, the user knows exactly what to do next — and can start it with one tap.

---

## 2. Core Design Principles

| Principle | Expression |
|---|---|
| **Today First** | Homepage answers only "what should I do now" |
| **Action First** | After recommendation, go directly into execution — not management |
| **Local First** | Data stays on-device by default; cloud sync requires explicit opt-in |
| **Calm AI** | AI is a low-noise partner, not a persistent chat overlay |
| **Premium Utility** | Visual quality comes from order, motion, and restraint — not decoration |

---

## 3. Target Users

### Primary: Self-Driven Individual Creators

- Independent developers, founders, freelancers, content creators
- Managing complex, self-directed multi-domain tasks simultaneously
- High AI tool adoption; willing to pay for execution leverage
- Socially connected — likely to share workflow tools

### Secondary

- Students preparing for high-stakes exams
- Remote workers managing async schedules
- Users with ADHD or attention management challenges
- Privacy-conscious professionals requiring local data control

### Core Pain Points

1. Too many tasks; can't decide where to start
2. Re-explaining context every work session
3. Hard to break ideas into actionable steps
4. Task tools become maintenance burdens over time
5. AI tools don't retain long-term user memory
6. Cloud tools create privacy anxiety

---

## 4. Phase 1 Scope

### In Scope

| Module | Description |
|---|---|
| **Today** | AI-recommended task + daily execution dashboard |
| **Matrix** | Eisenhower quadrant task organization |
| **Settings** | AI config, appearance, sync, privacy, account |
| **Auth** | Login, register, local-first user management |

### Explicitly Out of Scope (Phase 1)

- Complex project management / sub-tasks
- Analytics dashboard / full reporting
- Social sharing / team collaboration
- Calendar integration
- Mobile app

---

## 5. Information Architecture

### Primary Navigation (Desktop Left Rail)

```
Today        ← default entry point
Matrix       ← task organization
Settings     ← AI, appearance, sync, privacy, account
```

Chat, Memory, and Reports are **not** in the primary nav at Phase 1. They surface as contextual AI capabilities.

### Global Layout (Desktop)

```
┌─────────────────────────────────────────────────────┐
│  Left Nav (200px)  │  Main Content Area             │
│  ─ Brand           │  ─ Page-specific content        │
│  ─ Nav items       │  ─ No unrelated modules         │
│  ─ Local status    │                                 │
│                    │                         [Avatar]│
└─────────────────────────────────────────────────────┘
```

Top bar: page title, quick-add task, user avatar.

---

## 6. Module 1 — Today (Homepage)

### Purpose

One job: **help the user decide and begin the most important task today.**

### Screen Layout

```
┌──────────────────────────────────────┐
│  Lumo Status Bar                     │  ← AI one-liner, breathing indicator
├──────────────────────────────────────┤
│                                      │
│       Recommended Task Card          │  ← Visual center, full focus
│                                      │
├──────────────────────────────────────┤
│  Today Task List                     │  ← Compact secondary list
├──────────────────────────────────────┤
│  [ + Add a task or thought... ]      │  ← Natural language input
└──────────────────────────────────────┘
```

### Recommended Task Card — Required Fields

```
Task Title                         [Quadrant badge]
─────────────────────────────────────────────────
Recommendation reason (1 sentence, specific)
Due: [date]   Est: [Xh Xm]   Pomodoros: [●●○○]
─────────────────────────────────────────────────
[  Start  ]   [ Skip ]   [ Later ]   [ Details ]
```

**Recommendation copy must be:**
- Specific, not generic
- No anxiety manufacturing
- Example: *"This is due today and blocks the next design stage. One 25-min focus block to finish the first screen is enough."*

### Page States

| State | Behavior |
|---|---|
| Empty | Guide user to input their first task via natural language |
| Loading | Lightweight skeleton: "Sorting today's priorities…" |
| Recommended | Highlight single recommended task card |
| In Progress | Show active countdown, link back to Focus page |
| Completed | Restrained success feedback + next task suggestion |
| Error | Fallback to local task list; allow manual start |

### Key Interactions

- **Start** → task status becomes "in progress", auto-enter Pomodoro focus page
- **Skip** → new recommendation slides in, previous exits gently
- **Later** → task moves to bottom of Today list, not deleted
- **Natural language input** → AI auto-fills quadrant, estimated time, due info

### Motion Spec

| Trigger | Animation |
|---|---|
| Card first appear | Slight upward float + focus-in, 240ms ease-out |
| AI status area | Low-frequency breathing glow, 3s cycle |
| Task complete | Short green flash, 180ms — no trophy animations |
| Skip card | Slide-exit left, new card enters from right, 200ms |

---

## 7. Module 2 — Auth & User Management

### Strategy

> Allow local-first use. Login is triggered only when cloud sync, cross-device, or Pro features are needed.

**Never force login on first launch.**

### Login Page

Required elements:
- Brand mark + one value statement
- Email + Password fields
- Primary CTA: "Log In"
- OAuth: Google, Apple, GitHub
- Forgot password link
- "Register" link
- "Continue locally" link (prominent, not hidden)

**Copy:**  
*"Log in to unlock cloud sync and Pro features. Your local tasks are never uploaded without your permission."*

### Register Page

Required elements:
- Email, Password, Confirm Password
- Nickname (optional)
- Terms of Service + Privacy Policy checkbox
- "Register" CTA
- "Already have an account" link

Post-register flow: return to Today, show toast: *"You can enable sync in Settings."*

### User Management (inside Settings › Account)

| Section | Content |
|---|---|
| Identity | Avatar, nickname, email, subscription tier |
| Local Data | Task count, memory count, last local save timestamp |
| Cloud Sync | Status: off / syncing / synced / failed |
| Subscription | Free / Pro badge + upgrade CTA |
| Security | Change password, sign out, delete account |
| Data | Export local data, clear local data |

### User States

| State | Indicator |
|---|---|
| Local only (no login) | "Saved locally — data stays on this device" |
| Logged in, sync off | "Account active — cloud sync not enabled" |
| Logged in, sync on | "Last synced: [timestamp]" |
| Session expired | Toast: "Session expired — log in to re-enable sync" (local access unaffected) |
| Account deletion | Two-step confirm; clearly state local vs. cloud data outcome |

---

## 8. Module 3 — Matrix (Eisenhower Quadrant)

### Purpose

Task organization workspace. Answers: **"Where do these tasks belong and what's the priority?"**

Matrix is not the homepage. It's the structured thinking workspace.

### Layout

```
┌────────────────┬────────────────┐
│   Q1           │   Q2           │
│   Urgent +     │   Important,   │
│   Important    │   Not Urgent   │
├────────────────┼────────────────┤
│   Q3           │   Q4           │
│   Urgent,      │   Not Urgent,  │
│   Not Important│   Not Important│
└────────────────┴────────────────┘
[ Unclassified Pool — horizontal strip or side panel ]
```

### Task Card (Default View)

```
[●] Task Title                    [Q1]
    Due: Jan 15  ·  Est: 2h  ·  ●●○○
    [Start]  [Done]  [···]
```

Expanded / detail view shows: description, actual time logged, pomodoro history, AI suggestion reason.

### Core Operations

- Create task in any quadrant
- Drag unclassified tasks into quadrants
- Drag between quadrants
- Reorder within a quadrant
- Quick-start (enters Focus page)
- Quick-complete
- AI batch classify unclassified tasks
- Set a Matrix task as Today's recommendation

### AI Assistance in Matrix

AI lives at the **edges**, not the center:

| AI Touch Point | Format |
|---|---|
| Quadrant suggestion | Small badge on unclassified card: "Q2 suggested" |
| Suggestion reason | Hover tooltip or inline expand |
| Q1 overload warning | Subtle banner: "Q1 has 7 tasks — consider splitting or deferring" |
| Q4 excess warning | Inline: "4 Q4 tasks — archive?" |
| Today recommendation | "Set as Today's focus" button on any card |

Never use a full chat panel inside Matrix.

### Drag & Drop Spec

| Event | Behavior |
|---|---|
| Drag start | Card lifts with shadow, 150ms |
| Valid drop zone | Border highlights in quadrant accent color |
| Drop success | Instant save + 1.5s confirmation micro-feedback |
| Drop fail | Card snaps back to origin, 200ms ease |
| Post-move AI note | Brief label under card: "Recommendation context updated" — auto-dismiss 2s |

### Quadrant Visual Language

| Quadrant | Accent Color |
|---|---|
| Q1 | Low-sat coral red border |
| Q2 | Yellow-green border |
| Q3 | Cyan border |
| Q4 | Cool gray border |

Dark background throughout. Cards rely on clarity, not heavy shadows.

### Page States

| State | Behavior |
|---|---|
| Empty | Quadrant explainer + "Create your first task" |
| Normal | Tasks distributed across quadrants |
| Drag active | Drop zones highlighted |
| AI batch suggest | Unclassified cards show suggested quadrant badge |
| Q1 overload | Restrained warning banner |
| Save error | Card stays in place; retry option inline |

---

## 9. Module 4 — Settings

### Purpose

Give users confidence: **"I understand how the AI works, where my data lives, and how the interface fits me."**

### Navigation Structure

```
Settings
├── Account
├── AI
├── Appearance
├── Focus
├── Sync
├── Privacy
└── About
```

Phase 1 priority: **AI, Appearance, Sync, Privacy, Account.**

### AI Configuration

| Field | Notes |
|---|---|
| AI Status | Chip: Unconfigured / Connected / Error |
| Provider | OpenAI, Claude, Gemini, DeepSeek, Ollama, Custom |
| API Key | Masked input; never echoed post-save |
| Base URL | For custom/self-hosted providers |
| Model | Dropdown per provider |
| Test Connection | CTA with inline status feedback |
| Usage / Quota | Optional display |

Rules:
- API Key masked by default, toggle to reveal
- Save does not re-display full key
- Test failure shows a human-readable reason (not raw error)
- Without AI config, Today still works via rule-based recommendation
- Advanced model options marked as Pro (non-blocking)

### Appearance Configuration

| Option | Values |
|---|---|
| Theme | Dark (default), Light, System |
| Accent Color | Lumo Green, Calm Cyan, Warm Amber, Neutral Graphite |
| Motion Intensity | Standard, Reduced, Off |
| Card Density | Comfortable, Compact |

Rules:
- Accent affects: highlight rings, buttons, status indicators, some borders
- No combinations that break WCAG contrast minimums
- "Reduced motion" disables breathing glows and complex transitions

### Sync Configuration

Master copy:  
*"Your data is saved on this device by default. Data only reaches the cloud after you enable sync."*

| Control | Notes |
|---|---|
| Cloud Sync (master toggle) | Off by default |
| Task Sync | Sub-toggle |
| Memory Sync | Sub-toggle |
| Conversation Sync | Sub-toggle |
| Manual Sync button | Available when sync is on |
| Last Synced | Timestamp |
| Sync Status | Idle / Syncing / Success / Error |
| Error Message | Actionable, not technical |

### Privacy & Local Data

| Item | Notes |
|---|---|
| Local DB Location | Display path, copy button |
| Export Local Data | JSON or readable format |
| Local Backup | Manual trigger |
| Clear Local Data | Destructive — two-step confirm |
| Delete Cloud Data | Destructive — two-step confirm |
| AI Key Security Note | Brief explanation of local-only key storage |
| Privacy Policy | External link |

All destructive operations require two-step confirmation with explicit impact statement.

### Focus Configuration

| Setting | Default |
|---|---|
| Focus duration | 25 min |
| Short break | 5 min |
| Long break | 15 min |
| Long break interval | Every 4 pomodoros |
| Daily AI message limit | Configurable |
| Do Not Disturb schedule | Time range |

---

## 10. Pomodoro Focus Page

### Purpose

Bridge "decided to do" → "actively doing."

### Entry Points

- Accept Today recommendation → auto-start
- "Start" on any task in Today list
- "Start" in Matrix card or task detail

### Page Content

**Required:**
- Current task title
- Task description or key goal (1 line)
- Countdown timer (large, central)
- Session goal (user-set or AI-suggested)
- Pause / Resume
- Abandon / End early
- Mark task complete
- Start another pomodoro

**Recommended:**
- Current pomodoro round (e.g., 2 of 4)
- Total focus time today
- Task estimated vs. actual time
- Minimal Lumo status area

### Pomodoro State Flow

```
Ready → In Progress → Paused → Pomodoro Complete → [Continue | Rest | Done]
                                                 ↓
                                          Task Complete
```

Post-pomodoro settlement (lightweight modal):
- Mark task complete
- Start another pomodoro
- Return to Today
- Ask AI to summarize next step

### Focus Interruption Rules

| Trigger | Behavior |
|---|---|
| AI proactive message | Suppressed during active pomodoro |
| Scheduled check-ins | Paused |
| Bulk task changes | Queued for post-session |
| User-initiated AI query | Permitted (user-pull only) |

### Completion Feedback Principles

- Communicate "I made progress" — not over-rewarding
- Short, light, clear animation
- Show: session duration, task progress, suggested next step
- No badges, streaks popups, or gamification overlays during the moment

---

## 11. Task Data Model

### Core Fields (Required)

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| title | string | |
| description | string | optional |
| status | enum | pending / in_progress / completed / cancelled |
| quadrant | enum | Q1 / Q2 / Q3 / Q4 / unclassified |
| priority | enum | urgent / high / medium / low |
| due_date | datetime | optional |
| estimated_duration | minutes | optional |
| actual_duration | minutes | recorded |
| created_at | datetime | |
| updated_at | datetime | |

### Extended Fields (AI-Enhanced)

| Field | Type | Notes |
|---|---|---|
| estimated_pomodoros | int | AI or user-set |
| actual_pomodoros | int | recorded |
| ai_recommendation_reason | string | displayed in card |
| last_worked_at | datetime | |
| started_at | datetime | |
| completed_at | datetime | |

---

## 12. AI Behavior Rules

### Recommendation Logic Priority

1. Quadrant (Q1 first)
2. Due date proximity
3. User history and memory context
4. Estimated effort vs. available time
5. User-explicit overrides (starred, manually promoted)

### AI Message Triggers

| Trigger | Allowed |
|---|---|
| App open / first load | ✓ |
| User-initiated query | ✓ |
| Bulk task changes | ✓ (post-action) |
| Scheduled light greeting | ✓ (within daily limit) |
| Pomodoro start | ✗ |
| During active pomodoro | ✗ |
| Do Not Disturb window | ✗ |
| Daily limit reached | ✗ |

### AI Copy Voice

**Character:** Calm, precise, companionable execution partner.

| Do | Don't |
|---|---|
| Specific, one-step suggestions | Vague encouragement |
| Context-aware references | Lecturing or moralizing |
| Short sentences | Long explanations |
| Next action focused | Anxiety-inducing urgency |

**Examples:**  
- *"I looked at your tasks — this one makes the most sense to start now."*  
- *"This fits one 25-min session. Just get the first step done."*  
- *"You've changed several tasks. Want me to re-sort today's priorities?"*

---

## 13. Monetization Structure

### Freemium + Pro Subscription

| Capability | Free | Pro |
|---|---|---|
| Local task management | ✓ | ✓ |
| Today homepage | ✓ | ✓ |
| Basic Pomodoro | ✓ | ✓ |
| Basic AI recommendation | Limited | ✓ Unlimited |
| AI memory extraction | ✗ | ✓ |
| Cloud sync | ✗ | ✓ |
| Multi-model AI config | ✗ | ✓ |
| Advanced themes / motion | ✗ | ✓ |
| Focus stats + weekly reports | Basic | ✓ Full |
| AI focus debrief | ✗ | ✓ |
| Memory export | ✗ | ✓ |
| Advanced task parsing | ✗ | ✓ |

**Pro gate rule:** Pro features may show entry points, but free users must never feel blocked from the core loop on first session.

---

## 14. Non-Functional Requirements

### Performance

| Metric | Target |
|---|---|
| Cold start (desktop) | < 3s |
| Task list render | < 100ms |
| Local DB read/write | < 10ms |
| AI response (non-streaming) | < 5s |
| Pomodoro timer drift | Negligible |

### Security & Privacy

- Local SQLite/LibSQL storage by default
- Cloud sync opt-in only, explicit user action required
- Passwords: bcrypt
- API auth: Bearer Token
- AI API Keys: never returned in API responses, stored locally only
- Local DB path: system app-data directory

### Offline Capability

| Feature | Offline |
|---|---|
| Task management | ✓ |
| Pomodoro focus | ✓ |
| Memory management | ✓ |
| Cloud sync | Auto-resume on reconnect |
| Online AI | Requires network |
| Local LLM | Optional, advanced users |

---

## 15. Phase 1 Priority Stack

### P0 — Must Ship

- Today homepage (all states)
- Matrix (four quadrants + unclassified pool)
- Drag-and-drop between quadrants
- Recommended task card
- Accept recommendation → start task
- Pomodoro countdown
- Estimated vs. actual time tracking
- Task complete / pomodoro complete feedback
- AI proactive message (rule-based)
- Sync settings UI
- AI conversation streaming
- Windows installer package

### P1 — Next Iteration

- AI auto-extract memory from conversations
- AI structured task parsing + quadrant suggestion
- Memory management page
- Matrix bulk AI classify + overload alerts
- Focus stats + daily summary
- AI debrief and time estimate calibration
- Upgrade / Pro page

### P2 — Mid-term

- Task detail page enhancements
- Windows system notifications
- Advanced themes / motion
- macOS desktop app
- Apple ID login

### P3 — Long-term

- AI Tool Calling (create tasks, search memory, update tasks)
- Calendar integration
- Voice input
- Mobile app
- Web app
- Auto-update / system tray

---

## 16. First-Run Experience

### Flow

1. Welcome screen — *"Today, start with the one thing that matters most."*
2. User inputs 1–3 tasks they want to advance
3. Optional: set focus duration, daily message limit, DND window
4. Lumo generates Today view
5. First recommendation surfaces
6. User taps "Start" → enters Pomodoro focus

### First Aha Moment Target (< 60 seconds)

> *"Lumo told me what to do next, and I'm already in a countdown."*

---

## 17. Page Delivery Checklist (Phase 1)

Each page must cover: default state, empty state, loading state, error state, success feedback, and key motion spec.

| # | Page |
|---|---|
| 1 | First-run onboarding |
| 2 | Today — empty state |
| 3 | Today — with tasks |
| 4 | Today — recommended task active |
| 5 | Today — pomodoro in progress |
| 6 | Matrix — default |
| 7 | Matrix — drag active |
| 8 | Matrix — AI batch suggest |
| 9 | Quick create task modal |
| 10 | Pomodoro focus — in progress |
| 11 | Pomodoro complete settlement |
| 12 | Login page |
| 13 | Register page |
| 14 | Settings — AI config |
| 15 | Settings — Appearance |
| 16 | Settings — Sync |
| 17 | Settings — Privacy |
| 18 | Settings — Account |
