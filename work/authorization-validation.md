# Authorization validation

Status: implementation prepared; CI and emulator validation in progress. No production rules, data, identities, billing or hosting changes were made.

## Fixed paths

| Previous behavior | Proposed enforcement |
| --- | --- |
| New email containing `admin` grants admin | Firebase credential verification and explicit server-stored membership |
| Editable `currentUser` determines permissions | Server verifies token and reads active membership on every transaction |
| Browser password array and automatic signup | Firebase email/password login; trusted account provisioning |
| Browser-only task/progress/history changes | Firestore transactions with server-derived identity and timestamps |
| “Admin-only” user methods have no checks | Admin-enforced import, clear and membership removal APIs; no public role writes |
| Shared local-storage completion records | Authorized API snapshots, own-history filtering and memory-only sessions |
| PR/merge automatically deploys | Validation-only CI |

## Validation plan and results

- Local policy/source tests: 53 passed at initial implementation.
- HTTP tests: queued for CI because npm registry access is blocked in the session.
- Type checking and production build: queued for CI.
- Auth/Firestore emulator tests: queued for CI; cover real token verification, disabled accounts, membership removal, operator/admin access, forged fields, cross-user progress, concurrent completions, retries, direct Firestore denial and explicit deletion confirmation.

Emulator limitation: the integration suite uses the default emulator database to bind the exact deny-all rules file. The production adapter and `firebase.json` target the isolated named database `wrench`; source tests check that mapping. Emulator tests do **not** prove that rules are deployed to the named production database. Verify that binding in staging and production as a separate release gate.

## Required release review

1. Approve account provisioning and initial administrator, with verified UID/project mappings.
2. Inspect existing Firebase project state and confirm the dedicated database/IAM configuration.
3. Validate live deny-all client access for the named database and smoke-test the same-origin API with two operators and an administrator.
4. Verify removal/demotion, sign-out/account switching, failed writes and capacity errors in a browser.
5. Review bounded storage limits and explicitly approve any legacy-data migration.
6. Approve deployments independently. Merging code alone does not complete production remediation.

The current scope does not claim a production security certification. No live credentials were used for tests, and no existing browser-local records were uploaded.
