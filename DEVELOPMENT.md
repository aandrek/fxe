# Development Guide

## Setup

Install dependencies:

```bash
npm install
```

## Available Scripts

### Building

- `npm run build` - Build production bundle
- `npm run watch` - Build and watch for changes
- `npm run b` - Build development bundle

### Testing

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Code Quality

- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run validate` - Run all checks (type-check + lint + test)

## Code Quality Tools

### Jest

Configured for TypeScript with ts-jest. Tests are located alongside source files with `.test.ts` extension.

Coverage thresholds:

- Statements: 75%
- Branches: 55%
- Functions: 85%
- Lines: 75%

### ESLint

Using flat config format with TypeScript support. Rules include:

- TypeScript recommended rules
- Prettier integration
- No console warnings
- Prefer const over let/var

### Prettier

Configured with:

- Single quotes
- Semicolons
- 2 space indentation
- 100 character line width
- ES5 trailing commas

### Lint-staged

Pre-commit hooks are configured to run:

- ESLint auto-fix
- Prettier formatting
- Jest tests for changed files

## Project Structure

```
fxe/
├── src/
│   ├── Fxengine.ts        # Main library code
│   ├── Fxengine.test.ts   # Unit tests
│   └── index.ts           # Entry point
├── dist/                  # Production build output
├── coverage/              # Test coverage reports
├── jest.config.js         # Jest configuration
├── eslint.config.js       # ESLint configuration
├── .prettierrc.json       # Prettier configuration
└── tsconfig.json          # TypeScript configuration
```

## Contributing

Before committing:

1. Run `npm run validate` to ensure all checks pass
2. Write tests for new features
3. Update documentation as needed

## CI/CD

The validation script can be used in CI pipelines:

```bash
npm run validate
```

This runs:

1. TypeScript type checking
2. ESLint linting
3. Jest tests with coverage
