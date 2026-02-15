# Repository Split Guide

This document explains the repository split and how to extract the standalone directories into separate repositories.

## 📋 Overview

The Astrology App v2 monorepo has been reorganized into two standalone directories:

- **`backend-standalone/`** - Complete backend (Strapi API) ready for extraction
- **`frontend-standalone/`** - Complete frontend (React Native app) ready for extraction

Each directory contains everything needed to run independently:
- ✅ All source code
- ✅ Complete documentation (README, ARCHITECTURE, CONTRIBUTING, QUICKSTART)
- ✅ Configuration files (package.json, tsconfig.json, .gitignore, etc.)
- ✅ Environment variable templates

## 🎯 Why Split?

### Benefits of Separate Repositories

1. **Independent Development**
   - Frontend and backend teams can work independently
   - Different release cycles and versioning
   - Clearer ownership and responsibility

2. **Simplified CI/CD**
   - Separate build and deployment pipelines
   - Frontend: Deploy to App Store/Play Store
   - Backend: Deploy to Cloud Run/other hosting

3. **Better Access Control**
   - Different team permissions per repository
   - Frontend developers don't need backend access and vice versa

4. **Cleaner Git History**
   - Smaller, focused commit history
   - Easier to track changes relevant to each codebase

5. **Reduced Complexity**
   - Smaller repos are easier to navigate
   - Faster clone times
   - Simpler dependency management

## 🚀 Extraction Methods

### Method 1: Manual Copy (Recommended for Clean Start)

This method creates new repositories with fresh Git history:

#### Backend Repository

```bash
# 1. Create new repository on GitHub: astroappv2-backend

# 2. Clone the new repository
git clone https://github.com/cinderbrick1212/astroappv2-backend.git
cd astroappv2-backend

# 3. Copy contents from standalone directory
cp -r ../astroappv2/backend-standalone/* .
cp ../astroappv2/backend-standalone/.* . 2>/dev/null || true

# 4. Clean up (remove any unwanted files)
rm -f .DS_Store

# 5. Initial commit
git add .
git commit -m "Initial commit: Backend extracted from astroappv2 monorepo"
git push origin main
```

#### Frontend Repository

```bash
# 1. Create new repository on GitHub: astroappv2-frontend

# 2. Clone the new repository
git clone https://github.com/cinderbrick1212/astroappv2-frontend.git
cd astroappv2-frontend

# 3. Copy contents from standalone directory
cp -r ../astroappv2/frontend-standalone/* .
cp ../astroappv2/frontend-standalone/.* . 2>/dev/null || true

# 4. Clean up (remove any unwanted files)
rm -f .DS_Store

# 5. Initial commit
git add .
git commit -m "Initial commit: Frontend extracted from astroappv2 monorepo"
git push origin main
```

### Method 2: Git Subtree (Preserves History)

This method preserves the Git history for the subdirectory:

#### Backend Repository

```bash
cd astroappv2

# 1. Create a branch with only backend-standalone history
git subtree split --prefix=backend-standalone -b backend-only

# 2. Create new repository on GitHub: astroappv2-backend

# 3. Push the backend-only branch to new repository
git push https://github.com/cinderbrick1212/astroappv2-backend.git backend-only:main

# 4. Clean up local branch
git branch -D backend-only
```

#### Frontend Repository

```bash
cd astroappv2

# 1. Create a branch with only frontend-standalone history
git subtree split --prefix=frontend-standalone -b frontend-only

# 2. Create new repository on GitHub: astroappv2-frontend

# 3. Push the frontend-only branch to new repository
git push https://github.com/cinderbrick1212/astroappv2-frontend.git frontend-only:main

# 4. Clean up local branch
git branch -D frontend-only
```

### Method 3: Git Filter-Repo (Advanced)

For advanced users who want more control over history preservation:

```bash
# Install git-filter-repo
pip install git-filter-repo

# Backend
git clone astroappv2 astroappv2-backend
cd astroappv2-backend
git filter-repo --path backend-standalone/ --path-rename backend-standalone/:
git remote add origin https://github.com/cinderbrick1212/astroappv2-backend.git
git push origin main

# Frontend
git clone astroappv2 astroappv2-frontend
cd astroappv2-frontend
git filter-repo --path frontend-standalone/ --path-rename frontend-standalone/:
git remote add origin https://github.com/cinderbrick1212/astroappv2-frontend.git
git push origin main
```

## ✅ Post-Extraction Checklist

After extracting to separate repositories:

### Backend Repository
- [ ] Update repository description and README
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure secrets (Firebase, Razorpay, database credentials)
- [ ] Set up branch protection rules
- [ ] Configure deployment to Cloud Run
- [ ] Add contributors/team members
- [ ] Update any hardcoded references to repository structure

### Frontend Repository
- [ ] Update repository description and README
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure secrets (Firebase config, API keys)
- [ ] Set up EAS Build configuration
- [ ] Configure App Store Connect / Google Play Console
- [ ] Add contributors/team members
- [ ] Update API endpoint references if needed

### Both Repositories
- [ ] Set up issue templates
- [ ] Configure pull request templates
- [ ] Add CODE_OF_CONDUCT.md if needed
- [ ] Set up status badges in README
- [ ] Configure dependency security scanning
- [ ] Link repositories in documentation

## 🔗 Cross-Repository References

After splitting, update documentation to reference the other repository:

**In Backend README:**
```markdown
## Related Repositories

- [Frontend (Mobile App)](https://github.com/cinderbrick1212/astroappv2-frontend)
```

**In Frontend README:**
```markdown
## Related Repositories

- [Backend (API)](https://github.com/cinderbrick1212/astroappv2-backend)
```

## 📝 Updating Repository URLs

If you need to update repository URLs in configuration files:

**Backend:** Check these files for repository references:
- `package.json` (repository field)
- `README.md` (clone instructions)
- `CONTRIBUTING.md` (repository URLs)

**Frontend:** Check these files for repository references:
- `package.json` (repository field)
- `app.json` (if it contains repository info)
- `README.md` (clone instructions)
- `CONTRIBUTING.md` (repository URLs)

## 🤝 Development After Split

### Local Development

Developers can clone and work on repositories independently:

```bash
# Backend developer
git clone https://github.com/cinderbrick1212/astroappv2-backend.git
cd astroappv2-backend
npm install
npm run develop

# Frontend developer
git clone https://github.com/cinderbrick1212/astroappv2-frontend.git
cd astroappv2-frontend
npm install
npm start
```

### Full Stack Development

Developers working on both can clone both repositories:

```bash
mkdir astroapp
cd astroapp

# Clone both
git clone https://github.com/cinderbrick1212/astroappv2-backend.git backend
git clone https://github.com/cinderbrick1212/astroappv2-frontend.git frontend

# Work on both
cd backend && npm install && npm run develop &
cd ../frontend && npm install && npm start
```

## 🔄 Syncing Changes (During Transition)

If you need to keep the monorepo updated while transitioning:

1. Make changes in the appropriate standalone repository
2. Copy back to monorepo if needed (temporary, during transition)
3. Eventually archive or deprecate the monorepo

## 📦 Archiving the Monorepo

Once extraction is complete and teams have migrated:

1. Add a clear note to the README about the split
2. Point to the new repositories
3. Archive the repository on GitHub (Settings → Archive this repository)

Example README note:
```markdown
# ⚠️ This Repository Has Been Split

This monorepo has been split into two separate repositories:

- **Backend API**: https://github.com/cinderbrick1212/astroappv2-backend
- **Frontend App**: https://github.com/cinderbrick1212/astroappv2-frontend

This repository is now archived. Please use the separate repositories above.
```

## 💡 Tips

1. **Choose the right method**: Use Method 1 for a clean start, Method 2 to preserve history
2. **Test before pushing**: Verify everything works in the new repositories before archiving the monorepo
3. **Communicate changes**: Inform all team members about the repository split
4. **Update documentation**: Ensure all docs reference the correct new repositories
5. **Update CI/CD**: Set up appropriate pipelines in each repository
6. **Consider dependencies**: If repos depend on each other, document the integration points

## 🆘 Troubleshooting

### Issue: Can't push to new repository
**Solution**: Make sure you've created the repository on GitHub and have proper permissions

### Issue: Files missing after extraction
**Solution**: Verify you copied hidden files (dotfiles) correctly:
```bash
cp -r source/. destination/
```

### Issue: Git history is too large
**Solution**: Consider using shallow clones or git-filter-repo to reduce history

### Issue: CI/CD broken after split
**Solution**: Update GitHub Actions workflows and secrets in each repository

## 📚 Additional Resources

- [Git Subtree Documentation](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging#_subtree_merge)
- [Git Filter-Repo Guide](https://github.com/newren/git-filter-repo)
- [GitHub Repository Best Practices](https://docs.github.com/en/repositories)

---

**Need Help?** Open an issue in the appropriate repository or contact the team.
