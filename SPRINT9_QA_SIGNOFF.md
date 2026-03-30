# Sprint 9 QA Signoff

Date: 2026-03-31
Environment: Production (HahuCloud)

## Public Surface

- [ ] Home page loads on HTTPS.
- [ ] Projects page loads.
- [ ] Governance page loads.
- [ ] Transparency page loads.
- [ ] Newsletter pages load.
- [ ] Contact page loads.
- [ ] Donate page loads and Checkout initializes.

## Admin Surface

- [ ] `/admin/dashboard` redirects to `/login` when logged out.
- [ ] Admin login succeeds with production credentials.
- [ ] `/login` redirects to `/admin/dashboard` when authenticated.
- [ ] Admin board CRUD verified.
- [ ] Admin projects CRUD verified.
- [ ] Admin newsletters CRUD verified.
- [ ] Admin reports upload verified.

## Payments and Webhooks

- [ ] Stripe live webhook endpoint configured.
- [ ] Successful checkout updates donation status to `completed`.
- [ ] Expired or failed checkout updates donation status to `failed`.

## Uploads and Assets

- [ ] Uploaded files resolve under `UPLOADS_PUBLIC_BASE_URL`.
- [ ] Newsletter images and PDF links resolve publicly.
- [ ] Board/project images render on public pages.

## Mobile and UX

- [ ] Home page layout verified on mobile viewport.
- [ ] Donate form usable on mobile viewport.
- [ ] Contact form usable on mobile viewport.
- [ ] Navbar/footer usability verified on mobile viewport.

## Monitoring

- [ ] No recurring 5xx logs in HahuCloud after go-live.
- [ ] Webhook endpoint receives 2xx for Stripe events.
- [ ] App restarts and uptime behavior are stable.

## Final Decision

- [ ] Approved for go-live
- [ ] Blocked (list blockers below)

### Blockers

- None recorded yet.
