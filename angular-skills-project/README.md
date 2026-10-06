# Angular + AI — Base workspace

Base workspace for building AI-assisted Angular projects, following the [angular.dev](https://angular.dev) recommendations for developing with AI.

This README is a log of the steps taken, so they can be replicated in other projects.

## Steps taken

### 1. Install the official Angular skills

```bash
npx skills add https://github.com/angular/skills
```

This command installs the 2 official skills from the [angular/skills](https://github.com/angular/skills) repository:

| Skill | Purpose |
|---|---|
| `angular-developer` | Generates Angular code and provides architecture and best-practice guidance (signals, forms, DI, routing, SSR, testing, etc.). |
| `angular-new-app` | Creates a new Angular application with the Angular CLI following modern guidelines. |

**Generated files:**

```
.agents/skills/
├── angular-developer/        # SKILL.md + references/
└── angular-new-app/          # SKILL.md
.claude/skills/
├── angular-developer -> ../../.agents/skills/angular-developer   (symlink)
└── angular-new-app   -> ../../.agents/skills/angular-new-app     (symlink)
skills-lock.json              # Record of installed skills (source and hash)
```

- `.agents/skills/` holds the actual skill content.
- `.claude/skills/` holds symlinks so Claude Code can discover them.
- `skills-lock.json` records the source (`angular/skills`) and the hash of each skill.

### 2. Add Angular's official AI context (best practices + llms.txt)

Source: [angular.dev/ai/develop-with-ai](https://angular.dev/ai/develop-with-ai)

**Downloaded files** (stored in `docs/ai/`):

| File | Size | Content |
|---|---|---|
| `best-practices.md` | ~3 KB | Angular and TypeScript best-practice rules ("Custom Prompts and System Instructions") |
| `llms.txt` | ~7 KB | Index with links to the key angular.dev guides |
| `llms-full.txt` | ~870 KB | Angular documentation compiled into a single file |

**Setup for Claude Code and GitHub Copilot:**

```
.github/copilot-instructions.md   # Single source of instructions (Copilot reads it natively)
CLAUDE.md                         # Imports the above via @.github/copilot-instructions.md
docs/ai/
├── best-practices.md             # Original download (reference only; not loaded directly)
├── llms.txt
└── llms-full.txt
```

**Layered strategy** so the skills and these files complement each other without conflicting:

| Layer | Source | When it's used |
|---|---|---|
| 1. Always on | Best practices (inside `copilot-instructions.md`) | In every conversation |
| 2. On demand | `angular-developer` / `angular-new-app` skills | When the task matches the skill |
| 3. Fallback | `docs/ai/llms.txt` / `docs/ai/llms-full.txt` | Only when neither the rules nor the skills cover the topic |

Key decisions:
- **Single source of truth:** the rules live in `.github/copilot-instructions.md` and Claude imports them, so there are no two copies to maintain.
- **`llms-full.txt` is never loaded in full** (~220k tokens). The instructions say to search for the topic heading (`# Control flow`, etc.) and read only that section.
- **Best practices don't replace the skills:** they are short rules that always apply, and the skills provide per-topic detail.
- **Conflict priority:** user instructions > project's Angular version > topic skill > best practices.

**To update** when Angular publishes new versions:
1. Re-download the 3 files into `docs/ai/`.
2. Copy the new content of `best-practices.md` into the bottom section of `.github/copilot-instructions.md`.
3. Update the skills with `npx skills add https://github.com/angular/skills`.

### 3. Angular CLI MCP (optional; not enabled in this workspace)

The [Angular CLI MCP server](https://angular.dev/ai/mcp) lets an MCP-capable AI host call Angular CLI tools. It complements, rather than replaces, the setup above: instructions and skills tell the agent how to work; MCP gives it tools to inspect and operate an Angular workspace.

Available tools include searching Angular's documentation, loading Angular best practices, listing projects from `angular.json`, running configured targets such as build and test, starting and monitoring a dev server, and analyzing OnPush/zoneless migrations. It also includes an interactive Angular tutor. Some tools can run commands or modify project files, so review tool requests as you would other agent actions.

This template does **not** enable the server by default. It has no Angular CLI project for the workspace tools to inspect, and its existing instructions, skills, and documentation already provide the guidance layer. Add MCP to an actual Angular app when you want the agent to use CLI-aware tools regularly, especially for build/test loops, dev-server feedback, project discovery, or migration analysis.

To enable it in a VS Code project, add `.vscode/mcp.json` at that project's root:

```json
{
   "servers": {
      "angular-cli": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "@angular/cli", "mcp"]
      }
   }
}
```

VS Code can then start the `angular-cli` server from its MCP controls. The first run may download the Angular CLI package through `npx`. To restrict the server to tools that do not modify the project, add `"--read-only"` to `args`; see the [Angular MCP documentation](https://angular.dev/ai/mcp) for other options and host-specific setup.


## 4. Reusing in another project

1. **Create the Angular app first:**
   ```bash
   ng new my-app
   ```
   When the CLI asks *"Which AI tools do you want to configure with Angular best practices?"*, choose **None**. Otherwise it generates its own `.github/copilot-instructions.md` and Claude config, which would clash with this setup.

2. **Copy these from this workspace** into the new project root:
   ```
   CLAUDE.md
   .github/copilot-instructions.md
   docs/ai/            # best-practices.md, llms.txt, llms-full.txt
   ```

3. **Re-install the skills** inside the new project:
   ```bash
   npx skills add https://github.com/angular/skills
   ```

> **Don't copy `.agents/` or `.claude/skills/`.** The symlinks in `.claude/skills/` use absolute paths that point to this workspace, so copied links would keep reading from here and break if this folder is moved or deleted. Re-running the command creates correct links and fetches the latest skill versions.

**Tip:** if you do this often, turn this workspace into a GitHub template repository containing only `CLAUDE.md`, `.github/` and `docs/ai/`, then copy from it and run step 3 for each new project.
