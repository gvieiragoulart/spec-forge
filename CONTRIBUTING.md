# Contributing to SpecForge

Thank you for your interest in contributing to SpecForge! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/spec-forge.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js >= 18.0
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

This starts the Docusaurus development server at `http://localhost:3000`.

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

### Serve Production Build

```bash
npm run serve
```

## Project Structure

```
spec-forge/
├── src/
│   ├── parser/           # OpenAPI parser
│   ├── extensions/       # Extension handlers
│   ├── types/           # TypeScript definitions
│   ├── components/      # React components
│   ├── pages/          # Documentation pages
│   └── css/            # Styles
├── docs/               # Documentation content
├── examples/           # Example specifications
├── static/            # Static assets
└── blog/             # Blog posts
```

## Contribution Guidelines

### Code Style

- Use TypeScript for all code
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add validation for custom tags
fix: correct parser error handling
docs: update route aliases documentation
```

### Pull Requests

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Keep PRs focused - one feature/fix per PR
6. Reference related issues

### Testing

Before submitting a PR:

1. Run type checking: `npm run typecheck`
2. Build the project: `npm run build`
3. Test manually if UI changes

### Documentation

- Update docs when adding/changing features
- Keep examples up to date
- Use clear, concise language
- Include code examples

## Types of Contributions

### Bug Reports

When reporting bugs, include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Code samples if applicable

### Feature Requests

When requesting features, include:
- Clear description
- Use cases
- Examples
- Why it's valuable

### Code Contributions

We welcome:
- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- Test additions
- Example additions

### Documentation Contributions

Help improve:
- API documentation
- Guides and tutorials
- Examples
- README
- Blog posts

## Extension Development

When adding new extensions:

1. Follow the `x-*` prefix convention
2. Add TypeScript types in `src/types/extensions.ts`
3. Create handler in `src/extensions/`
4. Add documentation in `docs/extensions/`
5. Update example spec in `examples/`
6. Add tests

## Questions?

- Open an issue for questions
- Join discussions on GitHub
- Check existing issues and docs

## Code of Conduct

Be respectful and professional:
- Welcome newcomers
- Be patient with questions
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- CHANGELOG.md
- GitHub contributors page
- Project documentation

Thank you for contributing to SpecForge! 🎉
