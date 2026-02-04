# Developer Onboarding - Credentials Setup

## Getting Development Credentials

To run the application locally, you'll need the development database credentials.

### Step 1: Copy the Template

```bash
cp SEED_DATA_CREDENTIALS.template.md SEED_DATA_CREDENTIALS.md
```

### Step 2: Get the Actual Credentials

**Option A: Request the complete file from repository owner**
- Contact the repo owner directly via Signal/WhatsApp/Teams/Email
- They will send you the actual `SEED_DATA_CREDENTIALS.md` file via secure channel
- Place it in the project root directory (it's already git-ignored)

**Option B: Request just the password**
- Copy the template file as described in Step 1
- Contact repo owner for the development password
- Fill in `[SET YOUR DEV PASSWORD]` with the provided password

**Secure channels to use:**
- ✅ Signal/WhatsApp (encrypted messaging)
- ✅ Direct email to repository owner
- ✅ Teams/Slack direct message (for initial contact)

**DO NOT** ask for credentials via:
- ❌ GitHub issues/PRs (public/searchable)
- ❌ Public chat channels
- ❌ Unencrypted group emails

### Step 3: Fill in Your Local File

Replace `[SET YOUR DEV PASSWORD]` in your local `SEED_DATA_CREDENTIALS.md` with the password provided by the team lead.

### Step 4: Verify

The file `SEED_DATA_CREDENTIALS.md` should:
- ✅ Exist on your local machine
- ✅ Contain actual passwords
- ✅ Never appear in `git status` (it's ignored)

---

## Current Development Password

**Team Lead**: Contact via secure channel for current password

**Password Rotation**: Development passwords are rotated monthly for security
