/**
 * Claude Hub — Central Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is the single source of truth for the hub.
 * Claude updates this file at the end of every session to register:
 *   - sessions[]   → one entry per conversation day
 *   - apps[]       → every HTML tool/app created
 *   - commands[]   → every terminal command or shell function created
 *
 * To add a new session: push a new object into sessions[].
 * To add a new app:     push a new object into apps[].
 * To add new commands:  push new objects into commands[].
 * ─────────────────────────────────────────────────────────────────────────────
 */

const HUB = {

  meta: {
    owner:       "Brahian",
    created:     "2026-05-05",
    lastUpdated: "2026-05-05",
    version:     "1.0.0",
    liveURL:     "https://qaeng-br.github.io/claudehub/",
    repo:        "https://github.com/QAEng-BR/claudehub"
  },

  // ── SESSIONS ───────────────────────────────────────────────────────────────
  // One entry per day. Multiple conversations on the same day merge into one.
  sessions: [
    {
      id:      "2026-05-05",
      date:    "2026-05-05",
      title:   "System Optimization + Hub & Finance App",
      summary: "Diagnosed heavy memory pressure (2 users logged in, only 114 MB free). Optimized macOS settings, created shell helpers for video editing mode. Built Claude Hub library and Family Finance Dashboard.",
      tags:    ["optimization", "video-editing", "finance", "setup"],
      findings: [
        "MacBook Air M5, 16 GB RAM — two users logged in simultaneously (brahianrinconsanchez + nataliacano)",
        "nataliacano's WebKit process alone consumed 3.3 GB; total free RAM was 114 MB with active swap",
        "Microsoft Teams: ~800 MB across 3 processes; Windows App (Remote Desktop): ~400 MB",
        "Video editors installed: iMovie and CapCut — no Final Cut Pro (M5 ProRes hardware not fully used)",
        "Terminal was using 'Clear Dark' profile at default (~12 pt) font size"
      ],
      actions: [
        "Increased Terminal 'Clear Dark' font to 16 pt",
        "Reduced window animations (NSWindowResizeTime → 0.001)",
        "Disabled iCloud document auto-save",
        "Created ~/.zshrc with videomode, memstatus, and topmem commands",
        "Recommended logging out nataliacano before video editing to free 4–5 GB",
        "Recommended upgrading to Final Cut Pro for M5 ProRes hardware acceleration",
        "Built Claude Hub (this library)",
        "Built Family Finance Dashboard v1 (apps/finances.html)",
        "Rebuilt Finance Dashboard v2: added Credit Cards (visual + due-date countdown), Bills/Pagos with paid toggle, Home Credits with amortization progress, Savings for Colombia (COP) and USA (USD) with exchange rate, International spending tag, ES/EN toggle, Export CSV + JSON backup/import, mobile bottom-nav layout (iOS & Android ready)"
      ],
      apps:     ["finances"],
      commands: ["videomode", "memstatus", "topmem"]
    }
  ],

  // ── APPS ───────────────────────────────────────────────────────────────────
  apps: [
    {
      id:          "prompt-optimizer",
      name:        "Prompt Optimizer",
      description: "Paste any verbose or informal prompt — rewrites it with Claude Haiku into a tight, imperative version that uses fewer tokens. Keeps full history. Also available as terminal command `popt` and as an automatic Claude Code hook.",
      file:        "apps/prompt-optimizer.html",
      icon:        "⚡",
      color:       "#7c3aed",
      colorLight:  "#ede9fe",
      created:     "2026-05-05",
      updatedAt:   "2026-05-05",
      status:      "active",
      session:     "2026-05-05"
    },
    {
      id:          "finances",
      name:        "Family Finance Dashboard",
      description: "Full family finance tracker (ES/EN). Credit cards with visual display & due-date reminders, recurring bills with paid toggle, home credits with progress, savings accounts in Colombia (COP) and USA (USD), international spending tag, monthly trend chart, CSV + JSON export/import, mobile-first bottom nav (iOS/Android ready). Data in localStorage.",
      file:        "apps/finances.html",
      icon:        "💰",
      color:       "#059669",
      colorLight:  "#d1fae5",
      created:     "2026-05-05",
      updatedAt:   "2026-05-05",
      status:      "active",
      session:     "2026-05-05"
    }
  ],

  // ── TERMINAL COMMANDS & SHELL FUNCTIONS ────────────────────────────────────
  commands: [
    {
      name:        "videomode",
      syntax:      "videomode",
      description: "Prepares Mac for video editing: gracefully quits Microsoft Teams, Windows App, Mail and Photos, then runs sudo purge to reclaim compressed RAM.",
      notes:       "Requires sudo password for the purge step. Frees 1–5 GB depending on what is running.",
      file:        "~/.zshrc",
      created:     "2026-05-05",
      session:     "2026-05-05"
    },
    {
      name:        "memstatus",
      syntax:      "memstatus",
      description: "Prints a formatted breakdown of Free, Active, Inactive, Wired and Compressed memory in MB, plus the top 5 RAM-consuming processes.",
      notes:       "",
      file:        "~/.zshrc",
      created:     "2026-05-05",
      session:     "2026-05-05"
    },
    {
      name:        "topmem",
      syntax:      "topmem",
      description: "Lists the 15 biggest processes sorted by RAM usage, showing MB used, PID and process name.",
      notes:       "Alias — no arguments needed.",
      file:        "~/.zshrc",
      created:     "2026-05-05",
      session:     "2026-05-05"
    },
    {
      name:        "popt",
      syntax:      "popt \"your verbose prompt here\"",
      description: "Compresses a prompt using Claude Haiku: removes filler words and converts to imperative tone while preserving all technical details. Prints the original vs optimized comparison and copies the result to clipboard.",
      notes:       "Requires internet. Uses existing Claude Code auth — no API key setup needed. Result auto-copied to clipboard via pbcopy.",
      file:        "~/.zshrc",
      created:     "2026-05-05",
      session:     "2026-05-05"
    }
  ]

};
