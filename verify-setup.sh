#!/bin/bash

# Boilerplate Setup Verification Script
# Run this to verify the setup is complete and working

echo "======================================"
echo "  Astrology App v2 - Setup Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check npm
echo -n "Checking npm version... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check Backend
echo ""
echo "=== Backend (Strapi) ==="
cd backend
echo -n "Checking backend dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo "  Run: cd backend && npm install"
fi

echo -n "Checking TypeScript compilation... "
if npx tsc --noEmit 2>&1 | grep -q "error"; then
    echo -e "${RED}✗ TypeScript errors found${NC}"
else
    echo -e "${GREEN}✓ No errors${NC}"
fi

cd ..

# Check Mobile
echo ""
echo "=== Mobile (React Native + Expo) ==="
cd mobile
echo -n "Checking mobile dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo "  Run: cd mobile && npm install"
fi

echo -n "Checking TypeScript compilation... "
if npx tsc --noEmit 2>&1 | grep -q "error"; then
    echo -e "${RED}✗ TypeScript errors found${NC}"
else
    echo -e "${GREEN}✓ No errors${NC}"
fi

# Check project structure
cd ..
echo ""
echo "=== Project Structure ==="
echo -n "Checking backend structure... "
if [ -d "backend/src" ] && [ -d "backend/config" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

echo -n "Checking mobile structure... "
if [ -d "mobile/src" ] && [ -f "mobile/App.tsx" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Check documentation
echo ""
echo "=== Documentation ==="
DOCS=("README.md" "QUICKSTART.md" "CONTRIBUTING.md" "frontend.md" "backend.md" "mobile/README.md" "backend/README.md")
for doc in "${DOCS[@]}"; do
    echo -n "Checking $doc... "
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
done

# Summary
echo ""
echo "======================================"
echo "  Verification Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Read QUICKSTART.md for setup instructions"
echo "2. Start backend: cd backend && npm run develop"
echo "3. Start mobile: cd mobile && npm start"
echo ""
echo "For more information, see README.md"
