# Installer assets

Publish reviewed bootstrap scripts here as `cli.sh` and `ide.sh` when public releases are available. Next.js serves these as `/install/cli.sh` and `/install/ide.sh`; `next.config.ts` sets a text content type and revalidation-friendly caching.

The landing page deliberately marks both products unavailable until real public artifacts exist. Do not publish placeholder shell scripts or download private repositories with embedded credentials.

Before enabling a product in `lib/site-config.ts`:

1. Choose public versioned release artifacts and checksums.
2. Add the script, platform detection, prerequisite checks, checksum validation, and documented install destination.
3. Validate shell syntax and ShellCheck; exercise supported platforms in clean environments.
4. Set that product's `available` flag to `true` and update its prerequisite description.
5. Verify the deployed script URL and end-to-end command.

Application release updates can happen independently of this site if the bootstrap script resolves the selected release dynamically. Changes to a script itself require a site deployment.
