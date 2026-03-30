# Deployment Checklist

This checklist captures the minimum pre-deployment validation for the current baseline.

## 1. Baseline And Git Hygiene

- [ ] Working tree is clean (`git status` shows no unintended changes).
- [ ] Baseline commit exists on the active branch.
- [ ] `.env.example` is present and current.
- [ ] `docker-compose.yml` is present and current.
- [ ] `README.md` startup flow matches current local setup.

## 2. Local Database Reproducibility

- [ ] Start DB: `docker compose up -d`.
- [ ] Confirm DB container healthy: `docker compose ps`.
- [ ] Apply schema: `npx prisma db push`.
- [ ] Seed data: `npm run prisma:seed`.

## 3. Local App Startup

- [ ] Start app: `npm run dev`.
- [ ] App starts without fatal startup errors.

## 4. Smoke Routes

- [ ] `/` returns 200.
- [ ] `/projects` returns 200.
- [ ] `/governance` returns 200.
- [ ] `/transparency` returns 200.
- [ ] `/newsletter` returns 200.
- [ ] `/login` returns 200.
- [ ] Logged-out access to `/admin/dashboard` redirects to `/login`.
- [ ] After login, `/login` redirects to `/admin/dashboard`.

## 5. Release Readiness Notes

- [ ] Known blockers recorded (if any).
- [ ] DB/auth/payment issues documented before deploy.
- [ ] Rollback plan identified (previous working commit/tag).
