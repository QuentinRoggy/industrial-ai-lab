# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root: lists the bounded contexts and how they relate.
- **`app/modules/<module>/CONTEXT.md`**: the glossary of each module relevant to the topic.
- **`docs/decisions/`**: ADRs touching the area you are about to work in. All ADRs are system-wide; there are no per-module ADR folders.

If a module has no `CONTEXT.md` yet, **proceed silently**. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates glossaries lazily when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the module's `CONTEXT.md`. Don't drift to synonyms the glossary lists under _Avoid_.

If the concept you need isn't in a glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR 0004 (persistence strategy), but worth reopening because…_
