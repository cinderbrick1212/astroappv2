# Contributing Guide

Thank you for your interest in contributing to the Astrology App Backend! This guide will help you get started.

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for initial setup instructions.

## Project Structure

### Backend (`src/`)
```
src/
├── api/            # API endpoints and controllers
├── extensions/     # Strapi extensions
└── index.ts        # Entry point

config/             # Configuration files
types/              # Generated TypeScript types
database/           # Database configuration
```

## Code Style

### TypeScript
- Use TypeScript for all new files
- Prefer interfaces over types for objects
- Use explicit return types for functions
- Avoid `any` - use proper typing

### Strapi Best Practices
- Follow Strapi conventions for content types
- Use lifecycle hooks appropriately
- Keep controllers focused and testable
- Document custom endpoints

### Naming Conventions
- **Controllers**: PascalCase (e.g., `PaymentController.ts`)
- **Services**: camelCase (e.g., `notificationService.ts`)
- **Utils**: camelCase (e.g., `dateHelpers.ts`)
- **Types**: PascalCase for interfaces (e.g., `User`, `Payment`)
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
   npm run develop
   
   # Test in admin panel
   # Visit http://localhost:1337/admin
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

### Backend
```bash
# Type checking
npx tsc --noEmit

# Test admin panel
npm run develop
# Visit http://localhost:1337/admin

# Test API endpoints
# Use Postman, Insomnia, or curl
```

## Adding New Features

### New API Endpoint
1. Create controller file in `src/api/<content-type>/controllers/`
2. Define route in routes configuration
3. Implement business logic
4. Add proper authentication/authorization
5. Document in API.md

### New Content Type
1. Use Strapi admin to create content type
2. Configure fields and relations
3. Set up permissions
4. Test CRUD operations
5. Document in README

### New Service/Extension
1. Create file in `src/extensions/` or appropriate directory
2. Write TypeScript interfaces
3. Implement with proper error handling
4. Add JSDoc comments
5. Export and register properly

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Comments explain complex logic
- [ ] No hardcoded secrets (use environment variables)
- [ ] Error handling is implemented
- [ ] API endpoints are properly authenticated
- [ ] Changes tested in admin panel
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

### Database Migration
```bash
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

### Strapi
- [Strapi Docs](https://docs.strapi.io/)
- [Strapi Guides](https://strapi.io/resource-center)
- [Strapi TypeScript](https://docs.strapi.io/dev-docs/typescript)

### Backend Technologies
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Razorpay API](https://razorpay.com/docs/api/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Questions?

Feel free to reach out to the team or open an issue for clarification!
