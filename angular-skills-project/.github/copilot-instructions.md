# Project instructions (Angular + AI)

> Single source of instructions for coding assistants.
> - **GitHub Copilot** reads this file natively.
> - **Claude Code** imports it from `CLAUDE.md` (`@.github/copilot-instructions.md`).
>
> The "Angular Best Practices" section is a copy of `docs/ai/best-practices.md`
> (downloaded from https://angular.dev/ai/develop-with-ai). If that file is updated, update this section too.

## How to use the available Angular context

There are three sources of Angular knowledge. Use them in this order and **don't duplicate** what an earlier source already covers:

1. **Base rules (this file)** — always apply. These are the minimum style and best-practice rules.
2. **Official Angular skills** (`.agents/skills/`, linked in `.claude/skills/`):
   - `angular-developer` — detailed per-topic guidance (signals, forms, DI, routing, SSR, testing, styling, a11y...). Its `SKILL.md` says which `references/` file to read for each task.
   - `angular-new-app` — creating new applications with the Angular CLI.
   - When the task matches a skill topic, read the corresponding reference before generating code.
3. **Full official documentation** (`docs/ai/`) — fallback only, when neither these rules nor the skills cover the topic:
   - `docs/ai/llms.txt` — index (~7 KB) with links to the angular.dev guides. Use it to find a topic's URL.
   - `docs/ai/llms-full.txt` — compiled Angular documentation (~870 KB, ~18,500 lines). **Never read it in full.** Grep for the topic heading (sections start with `# `, e.g. `# Control flow`, `# Deferred loading with`) and read only that line range.

### Conflict resolution

- The project's Angular version (`package.json`) rules: don't use APIs that don't exist in that version.
- If a skill and these rules differ, follow the most specific and recent guidance for the topic (usually the skill) and mention it to the user.
- Explicit user instructions take priority over everything above.

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
