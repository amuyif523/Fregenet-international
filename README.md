# Fregenet Foundation

## Development Setup

### Local Database

This project uses a dedicated MariaDB container so it does not interfere with other local apps running on ports like `3306` or `3308`.

Database details:

```text
Container: fregenet-itl-db
Host: 127.0.0.1
Port: 3307
Database: set via DB_NAME (default: fregenet_international_db)
User: set via DB_USER (default: fregenet_admin)
Password: set via DB_PASSWORD (required for real environments)
```

Set these values in your local `.env` before running Docker:

```env
DATABASE_URL="mysql://fregenet_admin:change_me_db_password@127.0.0.1:3307/fregenet_international_db"
DB_NAME="fregenet_international_db"
DB_USER="fregenet_admin"
DB_PASSWORD="change_me_db_password"
DB_ROOT_PASSWORD="change_me_root_password"
```

If you change `DB_NAME`, `DB_USER`, or `DB_PASSWORD`, update `DATABASE_URL` to match the same local MariaDB container values.

### Upload Storage Configuration

In local development, uploads are written to `public/reports`, `public/images/board`, `public/images/projects`, and `public/images/newsletters`.

In production, set both environment variables below so uploaded files are stored in persistent storage and served from a stable public URL:

```env
UPLOADS_DIR="/var/www/fregenet-uploads"
UPLOADS_PUBLIC_BASE_URL="https://cdn.example.org/fregenet"
```

`UPLOADS_DIR` should point to a writable persistent directory (for example, mounted volume or shared filesystem).
`UPLOADS_PUBLIC_BASE_URL` should be the public URL prefix that maps to files in `UPLOADS_DIR`.

### First-Time Setup

Start the isolated database:

```bash
docker compose up -d
```

Check that the container is healthy:

```bash
docker compose ps
```

Sync the schema:

```bash
npx prisma db push
```

Seed initial data:

```bash
npm run prisma:seed
```

Start the dev server:

```bash
npm run dev
```

### Daily Workflow

Start services:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Stop services and delete database data:

```bash
docker compose down -v
```

### Verification

After the database is running and the schema is pushed:

```bash
npx prisma db push
npm run prisma:seed
npm run dev
```

Then verify all Sprint 0 smoke routes:

1. `/` returns `200`.
2. `/projects` returns `200`.
3. `/governance` returns `200`.
4. `/transparency` returns `200`.
5. `/newsletter` returns `200`.
6. `/login` returns `200`.
7. `/admin/dashboard` redirects to `/login` when logged out.

Authenticated redirect check:

1. Sign in from `/login`.
2. Revisit `/login` and confirm redirect to `/admin/dashboard`.

### Notes

- Do not use `npx prisma db pull` for local initialization here.
- Use `npx prisma db push` so the database matches `prisma/schema.prisma`.
- The MariaDB data is stored in the Docker volume `fregenet_data`.
- The container is bound to `127.0.0.1:3307`, so it is only exposed locally.

## Production Go-Live (Sprint 9)

- Runbook: `SPRINT9_HAHUCLOUD_GO_LIVE.md`
- Smoke script: `bash scripts/go-live-smoke.sh https://your-domain.example`
