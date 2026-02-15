#!/bin/bash

# Repository Split Verification Script
# Verifies that both standalone directories are complete and ready for extraction

echo "======================================"
echo "  Repository Split Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

total_checks=0
passed_checks=0

check() {
    total_checks=$((total_checks + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

echo -e "${BLUE}=== Backend Standalone Checks ===${NC}"

# Backend: Essential files
[ -f "backend-standalone/package.json" ]
check $? "package.json exists"

[ -f "backend-standalone/tsconfig.json" ]
check $? "tsconfig.json exists"

[ -f "backend-standalone/.gitignore" ]
check $? ".gitignore exists"

[ -f "backend-standalone/.env.example" ]
check $? ".env.example exists"

# Backend: Documentation
[ -f "backend-standalone/README.md" ]
check $? "README.md exists"

[ -f "backend-standalone/ARCHITECTURE.md" ]
check $? "ARCHITECTURE.md exists"

[ -f "backend-standalone/CONTRIBUTING.md" ]
check $? "CONTRIBUTING.md exists"

[ -f "backend-standalone/QUICKSTART.md" ]
check $? "QUICKSTART.md exists"

[ -f "backend-standalone/API.md" ]
check $? "API.md exists"

[ -f "backend-standalone/DEPLOYMENT.md" ]
check $? "DEPLOYMENT.md exists"

# Backend: Directory structure
[ -d "backend-standalone/src" ]
check $? "src/ directory exists"

[ -d "backend-standalone/config" ]
check $? "config/ directory exists"

[ -d "backend-standalone/database" ]
check $? "database/ directory exists"

echo ""
echo -e "${BLUE}=== Frontend Standalone Checks ===${NC}"

# Frontend: Essential files
[ -f "frontend-standalone/package.json" ]
check $? "package.json exists"

[ -f "frontend-standalone/tsconfig.json" ]
check $? "tsconfig.json exists"

[ -f "frontend-standalone/.gitignore" ]
check $? ".gitignore exists"

[ -f "frontend-standalone/.env.example" ]
check $? ".env.example exists"

[ -f "frontend-standalone/app.json" ]
check $? "app.json exists"

# Frontend: Documentation
[ -f "frontend-standalone/README.md" ]
check $? "README.md exists"

[ -f "frontend-standalone/ARCHITECTURE.md" ]
check $? "ARCHITECTURE.md exists"

[ -f "frontend-standalone/CONTRIBUTING.md" ]
check $? "CONTRIBUTING.md exists"

[ -f "frontend-standalone/QUICKSTART.md" ]
check $? "QUICKSTART.md exists"

# Frontend: Directory structure
[ -d "frontend-standalone/src" ]
check $? "src/ directory exists"

[ -d "frontend-standalone/assets" ]
check $? "assets/ directory exists"

echo ""
echo -e "${BLUE}=== Root Documentation Checks ===${NC}"

# Root: Updated documentation
[ -f "README.md" ]
check $? "README.md exists"

grep -q "standalone" README.md
check $? "README.md mentions standalone directories"

[ -f "SPLIT_GUIDE.md" ]
check $? "SPLIT_GUIDE.md exists"

[ -f "QUICKSTART.md" ]
check $? "QUICKSTART.md exists"

[ -f "CONTRIBUTING.md" ]
check $? "CONTRIBUTING.md exists"

# Check that documentation references standalone directories
grep -q "backend-standalone" README.md
check $? "README.md references backend-standalone"

grep -q "frontend-standalone" README.md
check $? "README.md references frontend-standalone"

echo ""
echo -e "${BLUE}=== Package Verification ===${NC}"

# Check package.json has proper structure
cat backend-standalone/package.json | grep -q '"name"'
check $? "Backend package.json has name field"

cat frontend-standalone/package.json | grep -q '"name"'
check $? "Frontend package.json has name field"

cat backend-standalone/package.json | grep -q '"scripts"'
check $? "Backend package.json has scripts"

cat frontend-standalone/package.json | grep -q '"scripts"'
check $? "Frontend package.json has scripts"

echo ""
echo "======================================"
echo -e "  Results: ${GREEN}${passed_checks}/${total_checks}${NC} checks passed"
echo "======================================"
echo ""

if [ $passed_checks -eq $total_checks ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "Both standalone directories are ready for extraction."
    echo ""
    echo "Next steps:"
    echo "1. Read SPLIT_GUIDE.md for extraction instructions"
    echo "2. Create new repositories on GitHub"
    echo "3. Extract using your preferred method"
    exit 0
else
    echo -e "${RED}✗ Some checks failed.${NC}"
    echo "Please review the output above and fix any issues."
    exit 1
fi
