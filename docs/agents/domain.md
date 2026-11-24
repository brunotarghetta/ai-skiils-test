# Domain documentation

## Layout

This is a single-context repository.

- `GLOSSARY.md` belongs at the repository root when domain terms need to be documented.
- `docs/adr/` belongs at the repository root for architectural decisions.
- Read relevant glossary entries and ADRs before exploring or changing a domain area.
- If these files do not exist, proceed without creating them up front.

## Use domain vocabulary

Use established project terms in specifications, issues, tests, and implementation notes. Do not silently replace a domain term with a synonym.

## Flag architectural conflicts

If a proposed change conflicts with an ADR, surface the ADR and the conflict explicitly before overriding or reopening the decision.
