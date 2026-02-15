# Contributing Guide

Thank you for your interest in contributing to Astrology App v2! This guide will help you get started.

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for initial setup instructions.

## Project Structure

### Mobile App (`mobile/`)
```
src/
├── navigation/     # App navigation logic
├── screens/        # Full screen components
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── services/       # Business logic (astrology calculations)
├── utils/          # Helper functions
├── theme/          # Design tokens (colors, spacing, typography)
├── types/          # TypeScript type definitions
└── locales/        # Translations (en, hi)
```

### Backend (`backend/`)
```
src/
├── api/            # API endpoints and controllers
├── extensions/     # Strapi extensions
└── index.ts        # Entry point

config/             # Configuration files
types/              # Generated TypeScript types
```

## Code Style

### TypeScript
- Use TypeScript for all new files
- Prefer interfaces over types for objects
- Use explicit return types for functions
- Avoid `any` - use proper typing

### React/React Native
- Use functional components with hooks
- Follow React hooks rules
- Use proper prop types
- Keep components small and focused

### Naming Conventions
- **Components**: PascalCase (e.g., `FeedItemCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `dateHelpers.ts`)
- **Types**: PascalCase for interfaces (e.g., `User`, `FeedItem`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)

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

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Follow project conventions
   - Add tests if applicable

3. **Test your changes**:
   ```bash
   # Mobile
   cd mobile
   npx tsc --noEmit
   npm start
   
   # Backend
   cd backend
   npx tsc --noEmit
   npm run develop
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

5. **Push to your branch**:
   ```bash
   git push origin feature/my-feature
   ```

6. **Create a Pull Request**:
   - Fill in the PR template
   - Link related issues
   - Request review from team members

7. **Address review feedback**:
   - Make requested changes
   - Push updates to the same branch
   - Respond to comments

8. **Merge**:
   - PRs require approval from at least one reviewer
   - Squash and merge to keep history clean

## Testing

### Mobile App
```bash
cd mobile

# Type checking
npx tsc --noEmit

# Run tests (when added)
npm test

# Manual testing on device
npm start
```

### Backend
```bash
cd backend

# Type checking
npx tsc --noEmit

# Test admin panel
npm run develop
# Visit http://localhost:1337/admin
```

## Adding New Features

### New Mobile Screen
1. Create screen file in `src/screens/`
2. Add to navigation in appropriate navigator
3. Create necessary components in `src/components/`
4. Add types to `src/types/index.ts`
5. Test on iOS and Android

### New Backend Content Type
1. Use Strapi admin to create content type
2. Configure fields and relations
3. Set up permissions
4. Test CRUD operations
5. Document in README

### New Service/Hook
1. Create file in appropriate directory
2. Write TypeScript interfaces
3. Implement with proper error handling
4. Add JSDoc comments
5. Export from index if needed

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Comments explain complex logic
- [ ] No hardcoded values (use config)
- [ ] Error handling is implemented
- [ ] Mobile changes tested on iOS and Android
- [ ] Backend changes tested in admin panel
- [ ] Documentation updated if needed

## Common Tasks

### Update Dependencies
```bash
# Mobile
cd mobile
npm update
npm audit fix

# Backend
cd backend
npm update
npm audit fix
```

### Add New Dependency
```bash
# Mobile
cd mobile
npm install package-name
# Update mobile/README.md if significant

# Backend
cd backend
npm install package-name
# Update backend/README.md if significant
```

### Database Migration (Backend)
```bash
cd backend
npm run strapi generate
# Follow prompts
npm run develop
```

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

### React Native
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

### Strapi
- [Strapi Docs](https://docs.strapi.io/)
- [Strapi Guides](https://strapi.io/resource-center)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Questions?

Feel free to reach out to the team or open an issue for clarification!
