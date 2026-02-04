Thank you for contributing to Wezeep! This document describes the recommended process for contributing to the repository.

1. How to contribute

- Fork the repository (or create a feature branch on the main repo if you have push access).
- Create a feature branch: `git checkout -b feat/short-descriptive-name`.
- Keep commits small and atomic. Use imperative commit messages: `Add feature X`, `Fix issue Y`.
- Run tests and linters locally before opening a Pull Request.

2. Pull request guidelines

- Target the `main` branch (or the branch specified by maintainers).
- Include a clear description of the change, motivation, and any migration or setup steps.
- Link related issues (if any) and add screenshots or logs for UI/UX changes.
- Add or update tests for behavior changes and ensure all checks pass.
- Keep PRs focused; split large changes into multiple PRs when possible.

3. Code style and tests

- Backend: follow existing Spring conventions and add unit/integration tests using JUnit.
- Mobile: follow TypeScript/React style used in the project; run `npm run lint` and fix issues.
- Strive for test coverage on critical flows (auth, payments, transfer flows).

4. Local development & verification

- Use `scripts/start-dev.ps1` (Windows) or `scripts/start-dev.sh` (macOS/Linux) to start backend & Expo together.
- Optionally use `docker-compose.dev.yml` to run Postgres and Redis in containers for a reproducible environment: `docker-compose -f docker-compose.dev.yml up --build`.

5. Security & responsible disclosure

- Do not include secrets or credentials in commits or PRs. Use `.env` files and add them to `.gitignore`.
- If you find a security vulnerability, follow the repository `SECURITY.md` if present; otherwise, contact the maintainers privately.

6. Communication

- Use descriptive PR titles and keep discussions in the PR thread.
- Be responsive to review comments. When a change is requested, update the PR with follow-up commits.

Thank you — we appreciate your contributions! 🎉
