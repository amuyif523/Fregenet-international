# Sprint 9: HahuCloud Deployment and Go-Live QA

Date: 2026-03-31

## Goal

Deploy safely to HahuCloud and validate end-to-end production behavior.

## 1) HahuCloud App Runtime Configuration

Use Node.js runtime with these app commands:

- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Health check path: `/`

Recommended runtime settings:

- Node.js version: 20.x LTS
- Auto restart on crash: enabled
- At least 1 persistent disk or mounted volume for uploads

## 2) Production Environment Variables

Set all required production env vars in HahuCloud app settings:

```env
NODE_ENV=production
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
JWT_SECRET=<long-random-secret>
ADMIN_PASSWORD=<strong-admin-password>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://your-domain.example
UPLOADS_DIR=/var/www/fregenet-uploads
UPLOADS_PUBLIC_BASE_URL=https://your-domain.example/uploads
```

Notes:

- `DATABASE_URL` must point to production DB.
- `UPLOADS_DIR` must be writable and persistent.
- `UPLOADS_PUBLIC_BASE_URL` must map to files stored in `UPLOADS_DIR`.

## 3) Domain + HTTPS

1. Point domain DNS to HahuCloud app endpoint.
2. Configure custom domain in HahuCloud.
3. Enable/verify SSL certificate issuance.
4. Confirm HTTPS redirect is active.

Verification commands:

```bash
curl -I https://your-domain.example/
curl -I http://your-domain.example/
```

Expected:

- HTTPS returns `200`.
- HTTP redirects to HTTPS (`301` or `308`).

## 4) Database and Prisma Sync

Run once after first deploy (or when schema changes):

```bash
npx prisma db push --accept-data-loss
npm run prisma:seed
```

If running inside HahuCloud shell, execute these there.

## 5) Stripe Webhook Registration (Production)

Register webhook endpoint:

- URL: `https://your-domain.example/api/webhooks/stripe`

Enable events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`

Copy webhook signing secret into:

- `STRIPE_WEBHOOK_SECRET`

## 6) Go-Live QA Checklist

Public flow:

- [ ] Home page loads over HTTPS with production assets.
- [ ] Project, governance, transparency, newsletter pages load.
- [ ] Donate flow opens Stripe Checkout.

Admin flow:

- [ ] `/admin/dashboard` redirects to `/login` while logged out.
- [ ] Admin login works with `ADMIN_PASSWORD`.
- [ ] Authenticated user revisiting `/login` redirects to `/admin/dashboard`.
- [ ] Admin CRUD works for board/projects/newsletters/reports.

Payments flow:

- [ ] Test donation reaches `pending` donation row.
- [ ] Webhook marks donation `completed` after successful payment.
- [ ] Failed/expired checkout marks donation `failed`.

Uploads/storage flow:

- [ ] Upload report and confirm file is served via `UPLOADS_PUBLIC_BASE_URL`.
- [ ] Upload board/project/newsletter images and verify public rendering.

Responsive/mobile QA:

- [ ] Home, donate, contact, newsletter render correctly on mobile viewport.
- [ ] Navigation and CTA buttons are usable on touch devices.

## 7) Monitoring and Post-Go-Live Checks

- [ ] Confirm app process uptime in HahuCloud dashboard.
- [ ] Confirm no repeating 5xx errors in logs.
- [ ] Confirm webhook endpoint receives 2xx for Stripe events.
- [ ] Confirm DB connection pool remains stable under normal traffic.

## 8) Rollback Plan

1. Keep previous known-good release tag/commit available.
2. If critical issue appears, roll back to previous release in HahuCloud.
3. Re-run smoke checks (`/`, `/login`, `/admin/dashboard`, `/donate`).

## 9) Completion Criteria

Sprint 9 is complete when all are true:

- Domain is live with HTTPS.
- Admin auth works in production.
- Donations complete and webhook status updates are verified.
- Assets load from cloud storage/public upload path.
- Final QA checklist is signed off.
