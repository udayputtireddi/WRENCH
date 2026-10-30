# WRENCH

Maintenance task catalog, operator progress, completion history and administrator reporting.
React/TypeScript frontend with an Express API, Firebase Authentication and a dedicated Firestore database.

## Status

The `fix/server-enforced-authorization` branch replaces the browser-only authentication demo with server authorization. **Not deployed or approved for production.** Review the [validation report](work/authorization-validation.md) before release. Existing browser-local data and accounts are not migrated automatically.

## Access model

- Firebase email/password sign-in verifies credentials. Unknown emails do not register automatically.
- Every API request verifies the Firebase ID token with revocation checking. Anonymous identities are rejected.
- Every data transaction rechecks an active `members/{uid}` record in the named **`wrench`** database. Email text, local storage, request bodies and client custom claims cannot grant roles.
- Approved operators can read the shared task/machine catalog, save their own progress and append their own completions. They receive only their own progress/history. This is a single-workplace model; there is no department or task-assignment isolation.
- Administrators can read team history/members, import task definitions, clear tasks with explicit confirmation and remove another member's WRENCH access. Self-removal is blocked. Member removal retains historical attribution and does not delete a potentially shared Firebase Auth account.
- Provisioning and role changes use a trusted offline administrator script. There is no public self-registration or role-mutation endpoint.
- Direct browser Firestore reads and writes are denied, including for administrators. Admin SDK access is governed by IAM and the API's authorization checks.
- Browser sessions and protected snapshots are held in memory. Closing/reloading the app requires sign-in. Sign-out clears the active snapshot; account changes invalidate in-flight responses. Focus and periodic refresh recheck access; server enforcement is immediate on subsequent requests.

## Development

Use Node 22. Clone `https://github.com/udayputtireddi/WRENCH.git`, then run `npm ci`.
Copy `.env.example` to an ignored `.env.local` and supply public Firebase web-app configuration.
Export `GCLOUD_PROJECT` into the server process and use Application Default Credentials for an isolated development project; do not use production credentials for tests.

- `npm run dev`: frontend and API at port 8080.
- `npm run typecheck`: TypeScript checks.
- `npm run test:security`: dependency-free policy and source regression tests.
- `npm run test:session`: session isolation, sign-out and stale-response tests.
- `npm run test:api`: HTTP authorization and error-boundary tests.
- `npm run test:emulators`: real Auth/Firestore emulator integration tests. Requires Java 21; uses only `demo-wrench`.
- `npm run build` and `npm start`: build and serve the frontend/API together.

## Runtime setup — approval required before execution

1. Verify the intended Firebase project. Existing Hosting workflow configuration referenced `checkmatesss`; no live Firebase configuration was inspected during this change.
2. Enable email/password Authentication and provision individual accounts in a trusted admin environment. Do not use the former demo credentials.
3. Create a Firestore Native database named `wrench`. Review and deploy the deny-all `firestore.rules` binding **only to this named database**. Existing default-database rules are outside this change.
4. Give a dedicated runtime identity the minimum Firebase Auth lookup and Firestore data access it needs. Use managed credentials, never web-bundled service-account JSON. Review database-scoped IAM and project boundaries.
5. Grant each existing Auth UID explicit membership using the script below, initially granting at least one reviewed administrator. The script modifies real membership data; do not run without approval.
6. Build the Docker image with the four public `VITE_FIREBASE_*` build arguments and deploy the Express runtime as Cloud Run service `wrench-api` in `us-central1`. Set `GCLOUD_PROJECT`; do not set emulator environment variables in production. Verify the service's routing/IAM, resource limits and billing before deployment.
7. Firebase Hosting routes `/api/**` to that service before the SPA fallback. Hosting-only deployment cannot supply this backend. Deploy only after explicit approval and a staging smoke test.

Trusted provisioning command (example placeholders; **not executed by this PR**):

```sh
node scripts/set-member.mjs PROJECT UID admin CONFIRM:PROJECT:UID:admin
```

Use `user` for operators or `disabled` to remove WRENCH access. Accounts must already exist and be enabled in Firebase Authentication. The script derives email/name from Firebase Auth and uses Application Default Credentials. Operators cannot run it with browser credentials. Protect administrative credentials separately.

Both legacy automatic Hosting workflows are replaced by validation-only CI. Opening a PR or merging this branch does not deploy it.

## Compatibility and limits

- Old `currentUser` and `wrench_completed_tasks` local-storage values are ignored, not imported or deleted. They are untrusted and may contain other users' records. Preserve/review any required exports separately before an explicitly approved migration.
- All writes require an online backend; success is shown after the server responds. Failed writes do not optimistically change the task catalog.
- Machines are derived from imported tasks. The old equipment form did not save machines and now says so.
- The old file-upload handler ignored the selected file and loaded hard-coded template rows. It is disabled with an explanation. Loading sample template tasks remains available to admins and now appends rather than silently clearing shared history.
- Settings controls that were previews now say so. Password changes use Firebase Auth and may require a fresh sign-in. The displayed MFA/timeout preferences do not enforce those policies.
- Server-assigned completion dates replace custom dates. Checklist entries remain operator attestations, not independently verified maintenance evidence. Safety/quality analytics are not compliance certifications.
- Initial bounded storage: at most 250 tasks, 250 active members visible in the dashboard, 100 tasks per import, 100 completions per task, two JPEG/PNG/WebP photos per entry (150 KB each), 700 KB serialized per task and 5 MB per authorized snapshot. Requests are limited to 120 successful operations per user per UTC minute. Capacity failures preserve existing records; archival/pagination and managed photo storage are follow-up work.
- These are application limits, not a cloud spending cap. Production abuse controls, alerting, backups and retention need operational review.

## Project map and next steps

- `server/security/`: authentication, input validation, authorization, transactional persistence and HTTP routes.
- `client/lib/session.ts`: Firebase login and authorized in-memory snapshot lifecycle.
- `scripts/set-member.mjs`: trusted provisioning.
- `tests/`: policy, API and emulator coverage.
- [Validation and release gates](work/authorization-validation.md).

Next: review the PR and staging configuration; validate live named-database rules before any deployment. Then replace bounded embedded photo/history storage with paginated records and managed object storage, and implement reviewed CSV import.
