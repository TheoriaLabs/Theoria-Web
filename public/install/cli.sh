#!/usr/bin/env bash
# Theoria CLI installer.
#
#   curl -fsSL https://www.theoria.sh/install/cli.sh | bash
#   curl -fsSL https://www.theoria.sh/install/cli.sh | THEORIA_VERSION=0.1.0-beta.1 bash
#
# Downloads a release from https://github.com/TheoriaLabs/theoria-cli-releases, verifies its SHA-256 checksum,
# installs it into ~/.theoria-cli/app/<version>, points ~/.theoria-cli/app/current at it, installs its npm
# dependencies, and links ~/.local/bin/theoria. Running it again upgrades. It never modifies your settings,
# sessions or credentials (~/.theoria-cli/agent, ~/.theoria-cli/config.json).
#
# Environment:
#   THEORIA_VERSION       version to install (default: the latest release)
#   THEORIA_INSTALL_DIR   where versions are installed (default: ~/.theoria-cli/app)
#   THEORIA_BIN_DIR       where the `theoria` command is linked (default: ~/.local/bin)
#   THEORIA_DOWNLOAD_URL  release download base (default: https://github.com/TheoriaLabs/theoria-cli-releases/releases)
#
# The whole script is a function called on the last line, so a partial download runs nothing.

set -euo pipefail

main() {
  local releases="${THEORIA_DOWNLOAD_URL:-https://github.com/TheoriaLabs/theoria-cli-releases/releases}"
  local install_dir="${THEORIA_INSTALL_DIR:-$HOME/.theoria-cli/app}"
  local bin_dir="${THEORIA_BIN_DIR:-$HOME/.local/bin}"
  local min_node="22.19.0"

  say() { printf '%s\n' "$*"; }
  warn() { printf 'theoria-install: warning: %s\n' "$*" >&2; }
  die() { printf 'theoria-install: error: %s\n' "$*" >&2; exit 1; }
  need() { command -v "$1" >/dev/null 2>&1 || die "$1 is required. $2"; }

  # Platform.
  case "$(uname -s)" in
    Darwin) ;;
    Linux) warn "Linux is not fully supported yet: the Telegram bot sandbox (sandbox-exec) and copy-on-write benchmark environments are macOS-only. Continuing." ;;
    *) die "unsupported operating system $(uname -s); Theoria CLI supports macOS (and Linux with limitations)." ;;
  esac

  # Tools.
  need curl "Install curl and run this again."
  need tar "Install tar and run this again."
  need node "Install Node.js $min_node or later (https://nodejs.org) and run this again."
  need npm "npm comes with Node.js; reinstall Node.js $min_node or later."
  local sha256
  if command -v shasum >/dev/null 2>&1; then sha256="shasum -a 256"
  elif command -v sha256sum >/dev/null 2>&1; then sha256="sha256sum"
  else die "shasum or sha256sum is required to verify the download."; fi

  local node_version
  node_version="$(node -p 'process.versions.node')"
  node -e '
    const [have, want] = process.argv.slice(1).map(v => v.split(".").map(Number));
    for (let i = 0; i < 3; i++) { if (have[i] > want[i]) process.exit(0); if (have[i] < want[i]) process.exit(1); }
  ' "$node_version" "$min_node" || die "Node.js $node_version is too old; Theoria CLI needs $min_node or later (https://nodejs.org)."

  # Version.
  local version="${THEORIA_VERSION:-}"
  version="${version#v}"
  if [ -z "$version" ]; then
    version="$(curl -fsSL "$releases/latest/download/VERSION")" || die "could not find the latest release at $releases."
    version="$(printf '%s' "$version" | tr -d '[:space:]')"
  fi
  case "$version" in
    [0-9]*.[0-9]*.[0-9]*) ;;
    *) die "\"$version\" is not a release version." ;;
  esac
  case "$version" in *[!0-9A-Za-z.-]*) die "\"$version\" is not a release version." ;; esac

  local name="theoria-cli-$version"
  local tarball="$name.tar.gz"
  local base="$releases/download/v$version"
  say "Installing Theoria CLI $version"

  # Download and verify.
  local tmp
  tmp="$(mktemp -d "${TMPDIR:-/tmp}/theoria-install.XXXXXX")"
  # shellcheck disable=SC2064  # expand now: tmp is local to main
  trap "rm -rf '$tmp'" EXIT
  curl -fsSL "$base/$tarball" -o "$tmp/$tarball" || die "could not download $base/$tarball."
  curl -fsSL "$base/SHA256SUMS" -o "$tmp/SHA256SUMS" || die "could not download $base/SHA256SUMS."
  local expected actual
  expected="$(awk -v file="$tarball" '$2 == file || $2 == "*" file { print $1 }' "$tmp/SHA256SUMS")"
  [ -n "$expected" ] || die "SHA256SUMS does not list $tarball."
  actual="$($sha256 "$tmp/$tarball" | awk '{ print $1 }')"
  [ "$expected" = "$actual" ] || die "checksum mismatch for $tarball (expected $expected, got $actual). Nothing was installed."
  say "  checksum verified (sha256 $actual)"

  # Extract next to the final location, install dependencies, then move into place.
  mkdir -p "$install_dir"
  local staging="$install_dir/.$version.$$"
  rm -rf "$staging"
  mkdir -p "$staging"
  tar -xzf "$tmp/$tarball" -C "$staging" --strip-components 1 || { rm -rf "$staging"; die "could not extract $tarball."; }
  local recorded
  recorded="$(node -p 'require(process.argv[1]).version' "$staging/release.json" 2>/dev/null || true)"
  [ "$recorded" = "$version" ] || { rm -rf "$staging"; die "the archive is not version $version (release.json says \"$recorded\")."; }
  say "  installing dependencies (npm ci --omit=dev)"
  (cd "$staging" && npm ci --omit=dev --no-audit --no-fund --update-notifier=false --loglevel=error) || { rm -rf "$staging"; die "npm could not install the dependencies."; }

  local previous=""
  if [ -L "$install_dir/current" ]; then previous="$(basename "$(readlink "$install_dir/current")")"; fi
  rm -rf "${install_dir:?}/$version"
  mv "$staging" "$install_dir/$version"
  ln -sfn "$version" "$install_dir/current"

  # Keep the new version and the one it replaces; remove older installations.
  local entry
  for entry in "$install_dir"/*; do
    [ -d "$entry" ] && [ ! -L "$entry" ] || continue
    case "$(basename "$entry")" in "$version"|"$previous") ;; *) rm -rf "$entry" ;; esac
  done

  # Link the command, without replacing a `theoria` that is not ours.
  mkdir -p "$bin_dir"
  local target="$install_dir/current/bin/theoria.js"
  if [ -e "$bin_dir/theoria" ] || [ -L "$bin_dir/theoria" ]; then
    case "$(readlink "$bin_dir/theoria" 2>/dev/null || true)" in
      "$target"|"$install_dir"/*) ;;
      *) die "$bin_dir/theoria exists and was not installed by this script. Remove it, or set THEORIA_BIN_DIR, and run this again." ;;
    esac
  fi
  chmod +x "$install_dir/$version/bin/theoria.js"
  ln -sfn "$target" "$bin_dir/theoria"

  say ""
  say "Installed: $("$bin_dir/theoria" version 2>/dev/null || printf 'Theoria CLI %s' "$version")"
  say "  files:   $install_dir/$version"
  say "  command: $bin_dir/theoria"
  [ -z "$previous" ] || [ "$previous" = "$version" ] || say "  replaced $previous (kept in $install_dir/$previous)"

  case ":$PATH:" in
    *":$bin_dir:"*)
      local found
      found="$(command -v theoria || true)"
      if [ -n "$found" ] && [ "$found" != "$bin_dir/theoria" ]; then warn "another theoria comes first on your PATH: $found"; fi ;;
    *)
      say ""
      say "$bin_dir is not on your PATH. Add it, for example:"
      say "  echo 'export PATH=\"$bin_dir:\$PATH\"' >> ~/.zshrc && source ~/.zshrc" ;;
  esac

  say ""
  say "Next steps:"
  say "  theoria                 start Theoria in a project folder"
  say "  /lean install           inside Theoria: install a Lean toolchain and Mathlib (needs elan: https://github.com/leanprover/elan)"
  say "  model credentials       Amazon Bedrock credentials, or an API key / login for another provider (see the README)"
  say ""
  say "Upgrade by running this installer again. Uninstall: rm -rf \"$install_dir\" \"$bin_dir/theoria\""
}

main "$@"
