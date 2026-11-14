# MED DZ — Neon PostgreSQL setup

GitHub stores the application source and SQL schema; it does not host a running PostgreSQL server. Neon is the database host. This repository contains the schema to initialize the MED DZ database.

## 1. Create the free Neon database

1. Create a Neon account and a PostgreSQL project in the Frankfurt region (if available on the selected plan).
2. Create a database named `med_dz`.
3. Copy the pooled or direct connection string from Neon. Keep it private.

## 2. Initialize the schema

Open the Neon SQL Editor for the new database and execute the complete contents of [schema.sql](./schema.sql).

This creates:
- student/owner account records;
- private and community medical-document metadata;
- AI classification and moderation event history;
- per-user document discussion messages;
- owner account and usage summary views.

The schema stores document metadata, not uploaded file binaries. A separate private object-storage service is required before files can be shared between users.

## 3. Connect the application

In the hosting provider's service environment, add:

- Key: `DATABASE_URL`
- Value: the Neon connection string

Never commit the connection string, database password, API keys, or any other secret to GitHub. Do not put secrets in frontend variables.

## 4. Important security rules

- Bootstrap the first owner account through a protected server-side secret or invitation; never allow a public signup request to choose the `owner` role.
- Keep new uploads private by default.
- AI classification is not proof of copyright permission. Unknown-rights files must remain private unless the uploader confirms permission or a valid license/public-domain basis is established.
- Do not expose owner-only views to student accounts.
- Do not store patient-identifiable or other sensitive personal data in this study library.

## 5. Verify before switching databases

1. Apply the schema in Neon.
2. Verify the tables and views exist.
3. Configure `DATABASE_URL` on the server.
4. Run application health and database connectivity checks.
5. Only after successful verification, plan migration from the temporary Render database.

No production database is created by committing these files to GitHub. Database provisioning and secret configuration happen in Neon and the hosting provider dashboards.
