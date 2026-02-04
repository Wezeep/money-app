# Development Seed Data Credentials Template

> 🔐 **NEED ACTUAL CREDENTIALS?**  
> This is a template with placeholder values only.  
> **Contact the repository owner for the actual `SEED_DATA_CREDENTIALS.md` file.**  
>   
> **How to get credentials:**  
> 1. Message me on Signal/WhatsApp/Teams  
> 2. Email me (request the credentials file)  
> 3. I will send you the actual file via secure channel  
> 4. Place it in the root directory (it's already in `.gitignore`)  
>   
> Alternatively, copy this file to `SEED_DATA_CREDENTIALS.md` and I'll share just the password.

## Backend Status
✅ Backend running on: **http://localhost:8082**  
✅ H2 Console accessible at: **http://localhost:8082/h2-console**

## H2 Database Connection Details

- **JDBC URL**: `jdbc:h2:mem:wezeep;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH`
- **Username**: `sa`
- **Password**: *(leave blank)*
- **Driver Class**: `org.h2.Driver`

## Test User Credentials

All users have the same password: **`[SET YOUR DEV PASSWORD]`**

### User 1 - John Doe
- **Email**: john.doe@example.com
- **Password**: [SET YOUR DEV PASSWORD]
- **Wezeep ID**: johndoe
- **Phone**: +14155551234
- **Home Country**: US
- **Preferred Currency**: USD

### User 2 - Jane Smith
- **Email**: jane.smith@example.com
- **Password**: [SET YOUR DEV PASSWORD]
- **Wezeep ID**: janesmith
- **Phone**: +14155555678
- **Home Country**: US
- **Preferred Currency**: USD

---

## 🔐 Setup Instructions for New Collaborators

1. Copy this file: `cp SEED_DATA_CREDENTIALS.template.md SEED_DATA_CREDENTIALS.md`
2. Contact the team lead for the actual development password
3. Replace `[SET YOUR DEV PASSWORD]` with the shared dev password
4. The file is in `.gitignore` and won't be committed

## Credential Sharing

Team lead will share the actual dev password via:
- Secure message (Signal, encrypted email)
- Team password manager (1Password shared vault)
- In-person/video call
