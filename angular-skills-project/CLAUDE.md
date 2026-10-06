# CLAUDE.md

Project instructions are shared with GitHub Copilot and live in a single file:

@.github/copilot-instructions.md

## Claude Code–specific notes

- The `angular-developer` and `angular-new-app` skills are available in `.claude/skills/` (symlinks to `.agents/skills/`). Invoke them when the task matches their description instead of searching `docs/ai/llms-full.txt`.
- To look things up in `docs/ai/llms-full.txt`, Grep for the topic heading (`^# <Topic>`) and then Read with `offset`/`limit`. Never read it in full: it costs ~220k tokens.
