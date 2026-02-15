# Contributing Guide

Thank you for your interest in contributing to the Astrology App Frontend! This guide will help you get started.

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for initial setup instructions.

## Project Structure

### Mobile App (`src/`)
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
   # Type checking
   npx tsc --noEmit
   
   # Start development server
   npm start
   
   # Test on iOS and Android
   # Press 'i' for iOS, 'a' for Android
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

### Frontend App
```bash
# Type checking
npx tsc --noEmit

# Run tests (when added)
npm test

# Manual testing on device
npm start
```

### Testing Checklist
- Test on iOS and Android
- Test authentication flows
- Test API integration
- Test offline behavior
- Test different screen sizes

## Adding New Features

### New Mobile Screen
1. Create screen file in `src/screens/`
2. Add to navigation in appropriate navigator
3. Create necessary components in `src/components/`
4. Add types to `src/types/index.ts`
5. Test on iOS and Android

### New Component
1. Create component file in `src/components/`
2. Write TypeScript prop types
3. Follow existing component patterns
4. Add to component index if needed

### New Hook
1. Create hook file in `src/hooks/`
2. Follow React hooks rules
3. Write TypeScript types
4. Add JSDoc comments
5. Test thoroughly

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Comments explain complex logic
- [ ] No hardcoded values (use config/environment variables)
- [ ] Error handling is implemented
- [ ] Mobile changes tested on iOS and Android
- [ ] UI looks good on different screen sizes
- [ ] Documentation updated if needed

## Common Tasks

### Update Dependencies
```bash
npm update
npm audit fix
```

### Add New Dependency
```bash
npm install package-name
# Update README.md if significant
```

### Clear Expo Cache
```bash
npx expo start -c
```

### Rebuild Native Code
```bash
# If you added native modules
npx expo prebuild
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

### State Management & Data
- [React Query](https://tanstack.com/query/latest)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Questions?

Feel free to reach out to the team or open an issue for clarification!
