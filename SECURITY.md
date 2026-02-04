# Security Policy

## Development Credentials

This repository uses a **template-based approach** for development credentials.

### 🔐 Setup for New Collaborators

1. Copy the template: `cp SEED_DATA_CREDENTIALS.template.md SEED_DATA_CREDENTIALS.md`
2. Contact the team lead via secure channel (Signal, 1Password) for actual dev password
3. Fill in the password in your local `SEED_DATA_CREDENTIALS.md` (this file is git-ignored)
4. Never commit the actual `SEED_DATA_CREDENTIALS.md` file

### ⚠️ Important Rules

1. **Actual credentials are NEVER committed to this repository**
2. **Never use dev credentials in production**
3. **Never reuse these passwords elsewhere**
4. **Template changes require code owner approval** (see CODEOWNERS)
5. **Share actual passwords only through secure channels** (Signal, encrypted email, password manager)

### For Collaborators

- Template file `SEED_DATA_CREDENTIALS.template.md` is committed (contains placeholders only)
- Actual file `SEED_DATA_CREDENTIALS.md` is git-ignored (contains real passwords locally)
- Use for seeding your local H2 database
- Do not share passwords outside the team or via insecure channels

### Production Credentials

Production credentials must NEVER be committed to this repository. Use:
- Azure Key Vault for production secrets
- Environment variables set in deployment pipelines
- GitHub Secrets for CI/CD workflows

### Incident Response

If credentials are accidentally exposed:
1. Immediately rotate all affected credentials
2. Remove from git history using `git filter-branch` or BFG Repo-Cleaner
3. Notify all team members
4. Review access logs for unauthorized access
