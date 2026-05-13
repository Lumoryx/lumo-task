# Lumo Task — UI/UX Design Specification

> Version: v1.0  
> Input for: Claude Design / High-Fidelity Prototype  
> Scope: Phase 1 — Today, Matrix, Auth, Settings  
> Last Updated: 2026-05-13

---

## 1. Design Intent

Lumo Task is not a traditional task manager. It is a **calm, intelligent execution partner** rendered as a desktop application. The interface should feel like a professional workstation — not a productivity app store.

**Single design thesis:**  
> The moment a user opens Lumo, they should feel oriented, not overwhelmed — and be one tap from starting the most important work of their day.

---

## 2. Visual Design System

### 2.1 Design Keywords

```
Restrained · Precise · Dark Premium · Locally Trusted · AI Ambient · Desktop Efficient
```

### 2.2 Color Palette

#### Base (Dark Theme — Default)

| Token | Value | Usage |
|---|---|---|
| `bg-base` | `#0D1210` | Page background (near-black green) |
| `bg-surface` | `#141A17` | Cards, panels |
| `bg-elevated` | `#1C2420` | Modals, dropdowns |
| `bg-subtle` | `#1F2822` | Hover states, selected rows |
| `border-default` | `#2A3530` | Dividers, card borders |
| `border-strong` | `#3A4840` | Focused inputs, active borders |

#### Text

| Token | Value | Usage |
|---|---|---|
| `text-primary` | `#E8EDE9` | Main content, titles |
| `text-secondary` | `#8FA89A` | Supporting text, metadata |
| `text-muted` | `#5A7268` | Placeholders, disabled |
| `text-inverse` | `#0D1210` | Text on light/accent backgrounds |

#### Accent (Configurable — Default: Lumo Green)

| Token | Value | Usage |
|---|---|---|
| `accent-primary` | `#3DFFA0` | AI highlights, recommended state, CTA focus ring |
| `accent-dim` | `#1A7A4A` | Subdued accent surfaces |
| `accent-glow` | `#3DFFA040` | Breathing glow overlay, active card halo |

#### Semantic Colors

| Token | Value | Usage |
|---|---|---|
| `status-urgent` | `#FF6B6B` | Q1, deadlines, risk alerts |
| `status-success` | `#A8E64B` | Completion feedback, sync OK |
| `status-warning` | `#FFB347` | Near-due, Q1 overload |
| `status-info` | `#5BC8D4` | Q3 accent, neutral AI prompts |
| `status-muted` | `#4A5A55` | Q4, archived, disabled |

#### Alternative Accent Themes

| Theme | Primary Accent | Character |
|---|---|---|
| Lumo Green (default) | `#3DFFA0` | Growth, focus |
| Calm Cyan | `#38D4D4` | Clarity, calm |
| Warm Amber | `#FFAA44` | Energy, warmth |
| Neutral Graphite | `#A0ADB0` | Minimal, serious |

#### Light Theme (Phase 2)

Light theme follows the same token structure with inverted base values. Not in scope for Phase 1 — placeholder tokens only.

### 2.3 Typography

#### Typeface

| Context | Font | Fallback |
|---|---|---|
| Latin text | Inter | system-ui, sans-serif |
| Chinese text | PingFang SC | Microsoft YaHei, sans-serif |
| Code / monospace | JetBrains Mono | Menlo, Consolas |

#### Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-display` | 28px | 600 | 1.2 | Page hero, empty state headline |
| `text-title` | 20px | 600 | 1.3 | Card title, section header |
| `text-body-lg` | 16px | 400 | 1.5 | Main body, task description |
| `text-body` | 14px | 400 | 1.5 | Default body, list items |
| `text-label` | 13px | 500 | 1.4 | Labels, badges, button text |
| `text-caption` | 12px | 400 | 1.4 | Metadata, timestamps |
| `text-micro` | 11px | 400 | 1.3 | Secondary metadata |

### 2.4 Spacing & Layout

Base unit: **4px**

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gap |
| `space-2` | 8px | Tight gap |
| `space-3` | 12px | Component padding |
| `space-4` | 16px | Card padding |
| `space-6` | 24px | Section gap |
| `space-8` | 32px | Major section break |
| `space-12` | 48px | Page-level spacing |

### 2.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Badges, chips, small inputs |
| `radius-md` | 8px | Cards, buttons, most controls |
| `radius-lg` | 12px | Modals, floating panels |

Do not use radius > 12px. No pill buttons on primary actions.

### 2.6 Elevation & Shadows

Shadows should be dark and directional — not diffuse light-box shadows.

| Level | Shadow | Usage |
|---|---|---|
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.4)` | Default cards |
| `shadow-lifted` | `0 8px 24px rgba(0,0,0,0.5)` | Dragging cards, modals |
| `shadow-focus-ring` | `0 0 0 2px accent-primary` | Keyboard focus |

No glass morphism. No heavy blur backgrounds. Surfaces should feel solid.

### 2.7 Iconography

- Style: **Line icons**, 1.5px stroke, no fill
- Size: 16px default, 20px for nav, 14px for inline
- Source: Lucide or Phosphor (consistent library — pick one)
- AI-specific icon: a minimal four-point ambient glow marker (custom)

### 2.8 Motion Specification

**Easing curves:**

| Name | Value | Use |
|---|---|---|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions |
| `ease-enter` | `cubic-bezier(0.0, 0, 0.2, 1)` | Elements appearing |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Drag-drop snap-back |

**Duration:**

| Token | Duration | Usage |
|---|---|---|
| `duration-fast` | 120ms | Micro interactions (hover, press) |
| `duration-base` | 200ms | State changes, button response |
| `duration-card` | 280ms | Card enter/exit, slide transitions |
| `duration-page` | 360ms | Page-level transitions |

**Motion rules:**
- Reduce motion preference → disable breathing glows and complex transitions; keep instant state changes
- Never animate more than 2 elements simultaneously
- No looping animations in task-critical areas

---

## 3. Component Library

### 3.1 Buttons

| Variant | Background | Text | Usage |
|---|---|---|---|
| Primary | `accent-primary` | `text-inverse` | Main CTA (Start, Save) |
| Secondary | `bg-elevated` | `text-primary` | Alternative actions |
| Ghost | transparent | `text-secondary` | Low-priority actions |
| Danger | transparent | `status-urgent` | Destructive actions (no background fill) |

Rules:
- Primary button: only one per screen section
- Danger button: never fills with red background in default state
- All buttons: 36px height, 12px horizontal padding, `radius-md`
- Focus state: `shadow-focus-ring` always visible

### 3.2 Input Fields

```
┌─────────────────────────────────────┐
│ Placeholder text                    │
└─────────────────────────────────────┘
  Default: border-default
  Focus:   border-strong + focus-ring accent
  Error:   status-urgent border
  Success: status-success border (brief, then neutral)
```

- Height: 40px
- Padding: 12px horizontal
- Masked inputs (API keys): show toggle button on right

### 3.3 Cards

**Task Card — Compact**

```
┌──────────────────────────────────────┐  radius-md
│  [●] Task Title               [Q1]  │  text-title
│      Due: Jan 15 · 2h · ●●○○        │  text-caption / text-secondary
│      [Start]  [Done]  [···]          │
└──────────────────────────────────────┘
```

**Recommended Task Card — Featured**

```
┌─────────────────────────────────────────────────┐
│  Recommended  ·  Q1                   [AI glow]  │
│                                                  │
│  Task Title (text-display)                       │
│                                                  │
│  Reason: "Due today, blocks next stage."         │
│  Due: Jan 15   Est: 1h 30m   Pomodoros: ●●○○    │
│                                                  │
│  [    Start    ]   [Skip]  [Later]  [Details]   │
└─────────────────────────────────────────────────┘
```
- Featured card has `accent-glow` halo in background
- Min height: 200px
- "Start" button is primary, full-width on mobile

### 3.4 Badges & Chips

| Type | Style |
|---|---|
| Quadrant Q1 | `status-urgent` text + border, `radius-sm` |
| Quadrant Q2 | `status-success` text + border |
| Quadrant Q3 | `status-info` text + border |
| Quadrant Q4 | `text-muted` text + border |
| AI suggested | `accent-dim` background, `accent-primary` text |
| Pro | `accent-primary` border, small |

### 3.5 Status Indicators

**AI Status Dot** (Lumo Status Bar):
- Idle: 4px circle, `accent-dim`, static
- Active: 6px circle, `accent-primary`, breathing pulse animation
- Error: 4px circle, `status-urgent`

**Sync Status Chip:**
- Off: gray, "Sync off"
- Syncing: animated dots, "Syncing…"
- Success: `status-success` dot, "Synced just now"
- Error: `status-urgent` dot, "Sync failed · Retry"

---

## 4. Page Specs

### 4.1 Today — Homepage

**Layout (desktop, 1280px+)**

```
Left Nav (200px fixed) | Main Content (flex 1) | [optional right panel]
```

**Main content zones:**

```
┌──────────────────────────────────────────────────────┐
│  Lumo Status Bar                              16px   │
│  [AI dot]  "I've sorted your priorities."            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Featured Recommended Task Card]           24px top │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Today's Tasks                               16px   │
│  ─── task row ─────────────────────────────         │
│  ─── task row ─────────────────────────────         │
│  ─── task row ─────────────────────────────         │
├──────────────────────────────────────────────────────┤
│  [ + Add a task or thought…          ]      16px   │
└──────────────────────────────────────────────────────┘
```

**Empty state:**

```
Center aligned, vertical stack:
  [ambient AI glow orb illustration — minimal]
  "What would you like to push forward today?"
  [ Start with your most important task… ]   ← input
```

**In-progress state:**

```
Lumo Status: "You're in a focus session."
[Resume Focus →]   ← primary accent button, full-width card
Below: today's remaining tasks (dimmed)
```

### 4.2 Matrix — Eisenhower Quadrant

**Grid layout:**

```
┌──────────────────────┬──────────────────────┐
│  Q1                  │  Q2                  │
│  Urgent + Important  │  Important, Not Urgent│
│  [coral border]      │  [green border]       │
│                      │                      │
│  task card           │  task card           │
│  task card           │  + Add task          │
│  + Add task          │                      │
├──────────────────────┼──────────────────────┤
│  Q3                  │  Q4                  │
│  Urgent, Not Imp     │  Not Urgent, Not Imp  │
│  [cyan border]       │  [gray border]        │
│                      │                      │
│  task card           │  task card           │
│  + Add task          │  + Add task          │
└──────────────────────┴──────────────────────┘

[ Unclassified  ──────────────────────  [AI Classify All] ]
  task pill · task pill · task pill · + Add
```

**Drag state spec:**
- Dragging card: `shadow-lifted`, 5deg rotation, `opacity: 0.9`
- Valid drop zone: quadrant border → accent color of that quadrant, `bg-subtle` fill
- Invalid drop zone: no highlight change

**AI Classify state:**
- Each unclassified card gets a soft badge overlay: `"→ Q2"` in `accent-dim` background
- User can tap badge to confirm or drag to override
- "Apply All" button: applies all AI suggestions at once

### 4.3 Login Page

**Layout: centered single column, max-width 400px, vertical center**

```
[Lumo logotype]
"Log in to sync your work and unlock Pro features."
"Your local tasks are always yours."

[Email field]
[Password field]
[Log In]  ← primary

─── or ───

[Continue with Google]
[Continue with Apple]
[Continue with GitHub]

Forgot password  ·  Create account

─────────────────────────
[Continue locally, no account]  ← ghost, centered, not hidden
```

### 4.4 Settings Layout

**Two-panel (desktop): 240px left nav + content area**

```
┌────────────────────┬──────────────────────────────────┐
│  Account           │  Content Area                    │
│  AI           ◀   │                                  │
│  Appearance        │  [Section title]                 │
│  Focus             │  [Setting rows]                  │
│  Sync              │                                  │
│  Privacy           │                                  │
│  About             │                                  │
└────────────────────┴──────────────────────────────────┘
```

**Setting row pattern:**

```
Label                          [Control — toggle / select / input]
Helper text (text-caption, text-muted)
```

Destructive settings always at bottom of section, with `status-urgent` text color on the action label.

---

## 5. Interaction Patterns

### 5.1 Natural Language Task Input

```
Trigger: click or focus on "Add a task…" input
Behavior: expands to full input line
Placeholder: "e.g. 'Finish homepage wireframes by Friday'"
On submit: AI parses → fills title, quadrant, due date, estimated time
Review: inline card preview appears below input with parsed fields
Confirm: [Add] button or Enter
Edit: user can adjust any parsed field before confirming
```

### 5.2 Recommended Task — Accept Flow

```
Click [Start]
  → Task status: in_progress
  → Today card: collapses to "In Progress" banner
  → Page transition (360ms): slide-up into Focus page
  → Focus page: countdown starts automatically
```

### 5.3 Pomodoro Session Flow

```
Active focus page:
  Large countdown (center)
  Task title (top, small)
  [Pause]  [Abandon]

Pause state:
  Timer frozen
  [Resume]  [End Session]

Pomodoro complete:
  Brief success flash (status-success, 300ms)
  Settlement overlay:
    "Session done. What next?"
    [Done with task]  [Another round]  [Back to Today]
```

### 5.4 Quick Task Creation in Matrix

```
Click "+ Add task" in any quadrant
  → Inline input appears in that quadrant
  → Press Enter: saves with just a title; auto-assigns quadrant
  → Press Tab: expand to full form (due date, estimate, notes)
  → Press Escape: cancel without saving
```

---

## 6. Responsive Behavior

**Phase 1 primary target: desktop 1280px–1920px**

| Breakpoint | Behavior |
|---|---|
| 1280px+ | Full three-zone layout: nav + content + optional panel |
| 1024px–1279px | Nav collapses to icon-only rail (48px); content expands |
| < 1024px | Out of scope (Phase 1); basic single-column fallback only |

Matrix quadrant grid:
- 1280px+: 2×2 grid
- 1024px: 2×2 grid with compressed card density
- Mobile: out of scope Phase 1

---

## 7. Accessibility Requirements

- Minimum contrast ratio: **4.5:1** for all body text (WCAG AA)
- Minimum contrast ratio: **3:1** for large text and UI components
- All interactive elements: keyboard focusable with visible focus ring (`shadow-focus-ring`)
- Destructive actions: require explicit confirmation (never triggered by single click/key)
- Reduced motion: `prefers-reduced-motion` must disable all breathing animations and complex transitions; state changes remain instant
- Screen reader: all interactive elements carry descriptive `aria-label`; task status changes announced via `aria-live`

---

## 8. Empty States

Each empty state must communicate: **what's missing + how to fix it + a sense of possibility (not abandonment).**

| Page | Empty State Copy | Action |
|---|---|---|
| Today | "What would you like to push forward today?" | Natural language input |
| Matrix | "Drop your tasks here — Lumo will help sort them." | "Add first task" per quadrant |
| Memory | "Lumo hasn't saved any memories yet." | "Add one manually" |
| AI (unconfigured) | "Connect an AI model to unlock smart recommendations." | "Configure AI" |

Visual treatment: centered layout, minimal ambient illustration (no heavy graphics), single CTA.

---

## 9. Error & Loading States

### Loading

- Skeleton screens preferred over spinners for content areas
- Spinner (16px, `accent-primary`) for button-level loading
- AI loading: animated ellipsis + "Thinking…" label beside AI status dot
- Max visible loading duration before fallback message: 8 seconds

### Error

| Scope | Treatment |
|---|---|
| Inline field error | Below field, `status-urgent` text, icon |
| Toast (recoverable) | Bottom-right, 4s auto-dismiss, action button optional |
| Full-page error | Centered message, retry CTA, no stack traces shown to user |
| AI error | Fallback to rule-based; show "AI offline — using local rules" in status bar |
| Sync error | Sync status chip shows error; settings surface detailed message |

---

## 10. Design Delivery Checklist

For each page, the designer must deliver:

- [ ] Default state (with representative content)
- [ ] Empty state
- [ ] Loading / skeleton state
- [ ] Error state
- [ ] Success / completion feedback
- [ ] Motion spec notes (what animates, duration, easing)
- [ ] Responsive notes (if applicable)
- [ ] Accessibility annotations (focus order, aria-label candidates)

### Phase 1 Page List

| # | Screen | Priority |
|---|---|---|
| 1 | First-run onboarding (welcome + task input) | P0 |
| 2 | Today — empty state | P0 |
| 3 | Today — tasks present, recommendation shown | P0 |
| 4 | Today — pomodoro in progress | P0 |
| 5 | Matrix — default (tasks in quadrants) | P0 |
| 6 | Matrix — drag active | P0 |
| 7 | Matrix — AI batch classify | P0 |
| 8 | Quick create task modal | P0 |
| 9 | Pomodoro focus — in progress | P0 |
| 10 | Pomodoro complete settlement | P0 |
| 11 | Login page | P0 |
| 12 | Register page | P0 |
| 13 | Settings — AI config | P0 |
| 14 | Settings — Appearance | P0 |
| 15 | Settings — Sync | P0 |
| 16 | Settings — Privacy & Data | P0 |
| 17 | Settings — Account | P0 |
| 18 | User management (logged in state) | P1 |
| 19 | AI conversation page | P1 |
| 20 | Memory management page | P1 |
| 21 | Pro upgrade page | P1 |

---

## 11. Design Anti-Patterns (Do Not Do)

| Anti-Pattern | Why Avoid |
|---|---|
| Large purple-blue gradients | Feels generic SaaS, undermines premium positioning |
| Gamification overlays (badges, streaks popup mid-session) | Interrupts focus, cheapens execution OS identity |
| Full chat panel inside Matrix | AI should be peripheral, not a takeover |
| Multiple primary CTAs per screen | Dilutes decision clarity |
| Force login on first launch | Breaks local-first trust promise |
| Heavy glass morphism / blur everywhere | Reduces legibility, feels 2021 |
| Colorful Kanban board aesthetic | Makes Matrix look like Trello — wrong identity |
| Inline success messages that persist | Should auto-dismiss; lingering feedback becomes noise |
| Error messages with technical stack traces | Always human-readable; logs go to console only |
| Animations looping in background during task work | Distraction in a focus tool is an anti-feature |
