# Windows Release Guide

This guide describes how to build and release the RAM Panchanga Windows desktop app.

## Release Inputs

Before any release, make sure the bundled data is current:

1. Regenerate the seed files in the `ram-panchanga-data` repo.
2. Copy the three location seeds into [data/generated](../data/generated).
3. Copy `kannada-transliterations.json` into [data/generated](../data/generated).

## Local Validation Checklist

Run these before building installers:

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run test:desktop-smoke
```

Then verify the app visually with:

```bash
npm run desktop:dev
```

Check at least:

- app boots without a blank screen
- main tabs navigate correctly
- seed data imports successfully
- search returns results
- settings changes persist across relaunch
- desktop window sizing is acceptable

## Versioning

Update versions before a release:

- bump `expo.version` in [app.json](../app.json)
- bump the Rust package version in [src-tauri/Cargo.toml](../src-tauri/Cargo.toml)
- keep [src-tauri/tauri.conf.json](../src-tauri/tauri.conf.json) in sync with the intended release version if changed there

## Build Prerequisites

The release machine needs:

- Rust via `rustup`
- Visual Studio Build Tools with MSVC and Windows SDK
- WebView2 runtime

Validate the environment:

```bash
npx tauri info
```

## Building Installers

Build release artifacts with:

```bash
npm run desktop:build
```

Expected outputs:

- `src-tauri/target/release/ram-panchanga-desktop.exe`
- `src-tauri/target/release/bundle/msi/...`
- `src-tauri/target/release/bundle/nsis/...`

## Distribution Caveats

### Code signing

The generated `.exe` and installer are not signed by default.

Without Authenticode signing:

- Windows SmartScreen may warn users
- enterprise environments may block installation
- the app will look unfinished to end users

Code-sign the release artifacts before public distribution.

### WebView2

Tauri uses the system WebView on Windows.

That means:

- Windows 11 machines are usually fine
- some Windows 10 machines may still need WebView2 installed

If you distribute broadly, document that prerequisite or add an installer/runtime strategy around it.

## Recommended Release Flow

1. Update bundled seed data.
2. Run validation commands.
3. Run the desktop app locally and verify core flows.
4. Build release installers with `npm run desktop:build`.
5. Code-sign the `.exe` and installer outputs.
6. Smoke-test installation on a clean Windows machine.
7. Publish the signed installers.

## Post-Build Verification

On a clean machine or VM, verify:

- installer launches
- app installs to the expected location
- app starts successfully
- no missing runtime dependency blocks launch
- SQLite/bootstrap still works after installation
- app relaunches with persisted settings

## Related Docs

- [README.md](../README.md)
- [WINDOWS_DESKTOP_GUIDE.md](./WINDOWS_DESKTOP_GUIDE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
