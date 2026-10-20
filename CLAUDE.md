# Udeler repository

**Last Updated:** 2026-10-20

This repository is maintained on branch `v1` through remote `o`. It inherits global fleet law from the workspace guides and `~/.claude/rules/`.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint with explicit paths, fetch and merge the designated upstream, push `v1`, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.
