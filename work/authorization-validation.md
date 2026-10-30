# Authorization validation

Status: implementation validated in CI; production release remains pending approval and staging checks. No production rules, data, identities, billing or hosting changes were made.

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

## Validation results

Validated code commit: `227188bdbd07f9f0b9027fe5e790777d48e784f7`.
[Passing GitHub Actions run](https://github.com/udayputtireddi/WRENCH/actions/runs/40986866004).

| Check | Result |
| --- | --- |
| Clean install from committed lockfile | Passed |
| Policy and source regression tests | 53 passed |
| HTTP API tests | 8 passed |
| Session lifecycle and account-isolation tests | 7 passed |
| Compiled runtime smoke test | 1 passed |
| Auth/Firestore emulator integration tests | 13 passed |
| TypeScript check | Passed |
| Frontend and server production builds | Passed |

**82 tests passed; none failed or skipped.** The runtime test verifies that the compiled server serves the SPA and refuses API access when unconfigured. Emulator tests use actual Firebase Auth token verification and Firestore transactions, including concurrent writes, membership changes, direct-client denial and rate-limit rollover. Session tests mock the Firebase browser SDK and network; they are not a rendered-browser test.

Existing UI type errors uncovered by validation were repaired: task status and completion fields now derive from the real task/history model, template tasks include progress arrays, the missing icon import is corrected, and report numbers are rendered with explicit types. CI uses the generated and committed dependency lock through `npm ci`.

Non-blocking build warnings remain: the client bundle exceeds Vite's default chunk-size recommendation, and the pinned GitHub action releases report Node-runtime deprecation warnings. These do not indicate test failures; dependency/action modernization and bundle splitting remain follow-up work.

Emulator limitation: the integration suite uses the default emulator database to bind the exact deny-all rules file. The production adapter and `firebase.json` target the isolated named database `wrench`; source tests check that mapping. Emulator tests do **not** prove that rules are deployed to the named production database. Verify that binding in staging and production as a separate release gate.

## Required release review

1. Approve account provisioning and initial administrator, with verified UID/project mappings.
2. Inspect existing Firebase project state and confirm the dedicated database/IAM configuration.
3. Validate live deny-all client access for the named database and smoke-test the same-origin API with two operators and an administrator.
4. Verify removal/demotion, sign-out/account switching, failed writes and capacity errors in a browser.
5. Review bounded storage limits and explicitly approve any legacy-data migration.
6. Approve deployments independently. Merging code alone does not complete production remediation.

The current scope does not claim a production security certification. No live credentials were used for tests, and no existing browser-local records were uploaded.

## Next highest-priority repository issue

[Synapse-AI- meeting APIs](https://github.com/udayputtireddi/Synapse-AI-/blob/main/server.ts) currently expose shared meeting reads, creates and updates without authentication or ownership checks. Protecting the AI gateway alone does not secure those records. The next proposed fix should add verified identity, per-owner persistence and cross-user access tests on a separate branch. No Synapse changes were made as part of this PR.
