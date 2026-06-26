# NPM Package Update & Publish Guide

## Update Version

Use one of these commands depending on the type of change:

```bash
# For a patch (0.4.10 → 0.4.11) - bug fixes, minor changes
npm version patch

# For a minor (0.4.10 → 0.5.0) - new features, backwards compatible
npm version minor

# For a major (0.4.10 → 1.0.0) - breaking changes
npm version major
```

This automatically:
- Updates the version in `package.json`
- Creates a git commit
- Creates a git tag

## Build the Project

```bash
npm run build
```

## Publish to npm

```bash
npm publish
```

For scoped packages (like @aandrek/fxe) that are public, use:

```bash
npm publish --access public
```

## Complete Workflow

```bash
# 1. Make sure everything is committed
git status

# 2. Update version (example with patch)
npm version patch

# 3. Build
npm run build

# 4. Publish
npm publish --access public

# 5. Push changes and tags to GitHub
git push && git push --tags
```

## Current Version

Current version: **0.4.10**

With `npm version patch` you'll go to **0.4.11**.
