# Fregenet International

## Development Setup

### Local Database

This project uses a dedicated MariaDB container so it does not interfere with other local apps running on ports like `3306` or `3308`.

Database details:

```text
Container: fregenet-itl-db
Host: 127.0.0.1
Port: 3307
Database: fregenet_international_db
User: fregenet_admin
Password: FrgITL!Db2026_x7Qm
```

The expected local connection string is:

```env
DATABASE_URL="mysql://fregenet_admin:FrgITL%21Db2026_x7Qm@127.0.0.1:3307/fregenet_international_db"
```

Update your local `.env` so `DATABASE_URL` matches the value above. Leave the other env vars in `.env` unchanged.

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
