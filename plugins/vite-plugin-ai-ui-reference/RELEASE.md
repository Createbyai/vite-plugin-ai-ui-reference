# Release checklist

## Before the first release

- Choose the package license and add its `LICENSE` file and `license` metadata.
- Create the GitHub repository, push this project, and enable Pages from the intended branch's `/docs` folder.
- Add the canonical GitHub repository URL and issue tracker to `package.json` once the repository URL is known.
- Confirm the npm package name is available and belongs to the intended publisher.
- Review both language READMEs, framework examples, tests, and the package file list from `npm pack --dry-run --json`.
- Run `npm test` in this directory and `npm run build` from the repository root on Node.js 20.19.0 or newer.

## Publish to npm

From this directory, update `version` in `package.json`, authenticate with the intended npm account, then run:

```sh
npm pack --dry-run --json
npm publish
```

The current package name is unscoped, so `npm publish` publishes it publicly by default. If the package is later renamed to a scope, check the intended access setting before publishing.

For later releases, update the version and repeat the tests and package inspection before publishing. Do not reuse an already-published version.

## Publish a GitHub release

After pushing the release commit, create a GitHub release with a tag such as `vite-plugin-ai-ui-reference-v0.1.0`. Link the matching npm version and summarize user-visible changes. GitHub Pages deployment is configured separately under **Settings → Pages**.

The package declares Vite 7 and Node.js 20.19.0 or newer. Keep this support range aligned with the integrations exercised by the release checks.
