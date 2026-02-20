# Repository Archive Notice

**Date**: February 2026  
**Status**: ARCHIVED AND READ-ONLY

## Migration Complete

This monorepo has been successfully split into separate repositories for better maintainability and development workflow.

### New Repositories

| Component | Repository | Description |
|-----------|-----------|-------------|
| Backend | [astroappv2backend](https://github.com/cinderbrick1212/astroappv2backend) | Strapi v5 CMS, API endpoints, database models, integrations |
| Frontend/Mobile | [astroappv2frontend](https://github.com/cinderbrick1212/astroappv2frontend) | React Native (Expo) mobile app, UI screens, components |

## What This Means

### For Developers
- ❌ **No new commits** will be accepted in this repository
- ❌ **No new issues or pull requests** should be opened here
- ✅ **Clone the new repositories** for active development
- ✅ **Existing documentation** remains available for reference

### For Users
- All future development happens in the new repositories
- Setup instructions are in each new repository's README
- Issue tracking is separate for backend and frontend
- Each repo has its own CI/CD and deployment pipeline

## Migration Details

### What Was Migrated

#### Backend Repository
- `/backend` directory → Complete Strapi application
- `backend.md` → Architecture documentation
- Backend-specific configurations and dependencies
- API routes, controllers, and models

#### Frontend Repository
- `/mobile` directory → Complete React Native app
- `frontend.md` → Architecture documentation  
- Mobile-specific configurations and dependencies
- Screens, components, services, and navigation

### What Remains Here
This archived repository retains:
- Historical commit history
- Original documentation (for reference)
- Project overview and context

## Action Required

### For Repository Maintainers
- [x] Update README.md with deprecation notice
- [x] Update CONTRIBUTING.md to redirect contributors
- [x] Update QUICKSTART.md to redirect developers
- [x] Create this ARCHIVE_NOTICE.md
- [ ] **Archive repository** via GitHub settings (Repository Settings → Danger Zone → Archive)
- [ ] **Lock conversations** to prevent new issues/PRs

### Archive Steps (Manual GitHub UI Actions)

Since archiving cannot be done via Git, a repository administrator must:

1. Go to `https://github.com/cinderbrick1212/astroappv2/settings`
2. Scroll to "Danger Zone"
3. Click "Archive this repository"
4. Confirm the action

Once archived:
- ✅ Repository becomes read-only
- ✅ No new issues, PRs, or commits allowed
- ✅ Code remains accessible for reference
- ✅ Existing URLs and links continue to work

## Questions?

For questions or support:
- **Backend**: Open an issue in [astroappv2backend](https://github.com/cinderbrick1212/astroappv2backend/issues)
- **Frontend/Mobile**: Open an issue in [astroappv2frontend](https://github.com/cinderbrick1212/astroappv2frontend/issues)

Thank you for using Astrology App v2!
