# Issue tracker: GitHub

Issues and specifications for this repository live in GitHub Issues.

## Conventions

- Repository: `brunotarghetta/ai-skiils-test`
- Use `gh` from the repository root for issue operations.
- Create an issue: `gh issue create --title "..." --body "..."`
- Read an issue: `gh issue view <number> --json number,title,body,labels,comments`
- List issues: `gh issue list --state open --json number,title,body,labels,comments`
- Comment: `gh issue comment <number> --body "..."`
- Apply or remove labels: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- Close an issue after explaining the resolution: comment first, then `gh issue close <number>`.

## Pull requests as a triage surface

**PRs as a request surface: no.** External pull requests are not part of the engineering issue queue.

GitHub Issues and pull requests share the number space. Resolve ambiguous numbers by checking pull requests first, then issues.

## When a skill says "publish to the issue tracker"

Create a GitHub issue in `brunotarghetta/ai-skiils-test`.

## When a skill says "fetch the relevant ticket"

Read the issue from GitHub using `gh issue view <number> --json number,title,body,labels,comments`.
