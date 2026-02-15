# Contributing Guide

Thank you for your interest in contributing to the Astrology App! This guide will help you get started with our split repository structure.

## 🎯 Repository Structure

This repository is organized with standalone directories for frontend and backend:

```
astroappv2/
├── frontend-standalone/   # Mobile app (React Native + Expo)
├── backend-standalone/    # API (Strapi)
├── frontend/              # Original (for reference)
└── backend/               # Original (for reference)
```

**Active development happens in the `*-standalone/` directories.**

## 📍 Where to Contribute

Choose the appropriate directory based on what you're working on:

- **Mobile App Features**: Work in `frontend-standalone/`
  - See [frontend-standalone/CONTRIBUTING.md](frontend-standalone/CONTRIBUTING.md)

- **Backend/API Features**: Work in `backend-standalone/`
  - See [backend-standalone/CONTRIBUTING.md](backend-standalone/CONTRIBUTING.md)

- **Documentation/Repository Structure**: Work at repository root

## Development Setup

### Full Stack Development

See [QUICKSTART.md](QUICKSTART.md) for initial setup of both frontend and backend.

### Frontend Only

```bash
cd frontend-standalone
npm install
# See frontend-standalone/QUICKSTART.md
```

### Backend Only

```bash
cd backend-standalone
npm install
# See backend-standalone/QUICKSTART.md
```

## Code Style

Each standalone directory has its own code style guide. Please refer to:

- **Frontend**: [frontend-standalone/CONTRIBUTING.md](frontend-standalone/CONTRIBUTING.md#code-style)
- **Backend**: [backend-standalone/CONTRIBUTING.md](backend-standalone/CONTRIBUTING.md#code-style)

### General Principles

- Use TypeScript for all new files
- Write clear, self-documenting code
- Add comments for complex logic
- Follow existing patterns in the codebase
- Keep functions focused and testable

## Git Workflow

### Branch Naming
- `feature/` - New features (e.g., `feature/login-screen`)
- `fix/` - Bug fixes (e.g., `fix/authentication-error`)
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

### Commit Messages
Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(auth): add Firebase email authentication

Implement email/password login flow with Firebase Auth.
Includes error handling and loading states.

Closes #123

fix(navigation): resolve tab bar rendering issue

The tab bar was not displaying correctly on iOS.
Updated navigation configuration to fix the issue.
```

## Pull Request Process

1. **Choose the right directory**:
   - Frontend changes: Work in `frontend-standalone/`
   - Backend changes: Work in `backend-standalone/`
   - Documentation: Work at repository root

2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make your changes**:
   - Follow the relevant style guide
   - Write clean, documented code
   - Add tests if applicable

4. **Test your changes**:
   - Frontend: See [frontend-standalone/CONTRIBUTING.md](frontend-standalone/CONTRIBUTING.md#testing)
   - Backend: See [backend-standalone/CONTRIBUTING.md](backend-standalone/CONTRIBUTING.md#testing)

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```
   Follow conventional commits format (see below)

6. **Push to your branch**:
   ```bash
   git push origin feature/my-feature
   ```

7. **Create a Pull Request**:
   - Fill in the PR template
   - Link related issues
   - Request review from team members

8. **Address review feedback**:
   - Make requested changes
   - Push updates to the same branch

9. **Merge**:
   - PRs require approval from at least one reviewer
   - Squash and merge to keep history clean

## Testing

### Frontend Testing
See [frontend-standalone/CONTRIBUTING.md](frontend-standalone/CONTRIBUTING.md#testing)

### Backend Testing
See [backend-standalone/CONTRIBUTING.md](backend-standalone/CONTRIBUTING.md#testing)

### Integration Testing
When testing features that span frontend and backend:
1. Start both services
2. Test the complete user flow
3. Verify data flows correctly between systems

## Adding New Features

Depending on what you're adding, refer to the appropriate guide:

### Frontend Features
See [frontend-standalone/CONTRIBUTING.md](frontend-standalone/CONTRIBUTING.md#adding-new-features)
- New mobile screens
- New components
- New hooks

### Backend Features
See [backend-standalone/CONTRIBUTING.md](backend-standalone/CONTRIBUTING.md#adding-new-features)
- New API endpoints
- New content types
- New services/extensions

### Full Stack Features
For features that span both:
1. Start with backend API changes
2. Test API endpoints
3. Implement frontend integration
4. Test end-to-end

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Changes are in the correct directory (`frontend-standalone/` or `backend-standalone/`)
- [ ] Code follows the relevant style guide
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Comments explain complex logic
- [ ] No hardcoded secrets or sensitive data
- [ ] Error handling is implemented
- [ ] Changes tested appropriately (frontend: iOS/Android, backend: API)
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional commits format

## Common Tasks

### Update Dependencies

```bash
# Frontend
cd frontend-standalone
npm update
npm audit fix

# Backend
cd backend-standalone
npm update
npm audit fix
```

### Add New Dependency

```bash
# Frontend
cd frontend-standalone
npm install package-name

# Backend
cd backend-standalone
npm install package-name
```

Always update the relevant README if the dependency is significant.

## Environment Variables

Never commit `.env` files. Always update `.env.example` when adding new environment variables:

```bash
# Good
NEW_API_KEY=                    # Leave empty in .env.example

# Bad
NEW_API_KEY=actual-secret-key   # Never commit secrets
```

## Documentation

When adding features, update:
- Relevant README files
- Code comments (JSDoc)
- Type definitions
- Architecture docs if significant

## Getting Help

- Check existing documentation
- Search closed issues/PRs
- Ask in team chat
- Create a GitHub issue

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- Focus on code, not people

## Resources

### Repository Documentation
- [Main README](README.md) - Overview and repository structure
- [QUICKSTART](QUICKSTART.md) - Getting started guide
- [Frontend CONTRIBUTING](frontend-standalone/CONTRIBUTING.md) - Frontend contribution guide
- [Backend CONTRIBUTING](backend-standalone/CONTRIBUTING.md) - Backend contribution guide

### Technology Documentation
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Strapi](https://docs.strapi.io/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Firebase](https://firebase.google.com/docs)

## Important Notes

### About Standalone Directories

The `frontend-standalone/` and `backend-standalone/` directories are complete, self-contained projects designed to be extracted into separate repositories. When contributing:

- ✅ Make changes in `*-standalone/` directories
- ❌ Don't modify original `frontend/` or `backend/` directories (kept for reference)
- 📝 Update documentation in both the standalone directory AND root if needed

### Working Across Multiple Directories

If your feature requires changes to both frontend and backend:
1. Make backend changes first and test them
2. Make frontend changes second
3. Test the integration
4. Submit separate PRs or one PR with changes to both directories

## Questions?

Feel free to reach out to the team or open an issue for clarification!
