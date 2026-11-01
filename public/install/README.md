# Installer assets

`cli.sh` is the Theoria CLI installer, served as `/install/cli.sh`:

```sh
curl -fsSL https://www.theoria.sh/install/cli.sh | bash
```

It downloads a release from [TheoriaLabs/theoria-cli-releases](https://github.com/TheoriaLabs/theoria-cli-releases),
verifies the tarball against the release's `SHA256SUMS`, installs it into `~/.theoria-cli/app/<version>`, runs
`npm ci --omit=dev`, and links `~/.local/bin/theoria`. Without `THEORIA_VERSION` it reads the latest version from the
release's `VERSION` asset (`releases/latest/download/VERSION`), so new CLI releases need no site deployment. Changing
the script does. `next.config.ts` serves `*.sh` here as plain text with revalidation-friendly caching.

The CLI repository publishes releases from tags (`.github/workflows/release.yml` there); each release must include
`theoria-cli-<version>.tar.gz`, `SHA256SUMS` and `VERSION`.

Before changing the script:

1. Keep the whole script inside `main`, called on the last line, so a partial download runs nothing.
2. Run `bash -n public/install/cli.sh` and `shellcheck public/install/cli.sh`.
3. Test against a local release layout. Point `THEORIA_DOWNLOAD_URL` at a `file://` directory containing
   `latest/download/VERSION` and `download/v<version>/{theoria-cli-<version>.tar.gz,SHA256SUMS}`, and use a temporary
   `HOME`.
4. After deploying, run the published command end to end in a clean environment.

`ide.sh` is not published: the IDE stays locked and labelled Coming soon in `lib/site-config.ts` until it has a real
release. Do not publish placeholder scripts or download private repositories with embedded credentials.
