# NADMO AI Android Signing

NADMO AI uses a permanent Android signing key for production updates.

## Package identity

- Application ID: `com.nadmo.ai`
- Release line: `1.1.0`
- Version code: `11`

## Required GitHub Actions secrets

The workflow `.github/workflows/release-apk.yml` expects:

- `NADMO_RELEASE_KEYSTORE_B64`
- `NADMO_RELEASE_STORE_PASSWORD`
- `NADMO_RELEASE_KEY_ALIAS`
- `NADMO_RELEASE_KEY_PASSWORD`

Never commit the signing keystore or any of these secret values to the repository.

## Release

After the four secrets are configured, run **Build Permanent Signed APK** from GitHub Actions. The workflow validates JavaScript, creates and syncs the Capacitor Android project, applies NADMO AI identity/versioning, builds `assembleRelease`, verifies the APK signature with `apksigner`, generates a SHA-256 checksum, and uploads the signed release artifact.

## Key continuity

Every future Android update for `com.nadmo.ai` must be signed with the same permanent key. Keep at least two secure offline backups of the signing keystore.
