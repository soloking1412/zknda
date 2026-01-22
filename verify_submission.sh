#!/bin/bash

# zkNDA Wave 1 Submission Verification Script
# This script verifies that all components are working correctly

echo "🚀 zkNDA Wave 1 Submission Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_PASSED=true

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ALL_PASSED=false
        return 1
    fi
}

# Function to run test
run_test() {
    echo -e "\n${YELLOW}Testing:${NC} $1"
    echo "----------------------------------------"
}

# 1. Check Prerequisites
run_test "Prerequisites"
check_command "leo"
check_command "node"
check_command "npm"

# 2. Test Leo Contract Build
run_test "Leo Contract Compilation"
cd contract/zknda
if leo build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Leo contract compiles successfully"
else
    echo -e "${RED}✗${NC} Leo contract compilation FAILED"
    ALL_PASSED=false
fi
cd ../..

# 3. Test Frontend Build
run_test "Frontend Build"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install > /dev/null 2>&1
fi

if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend builds successfully"

    # Check bundle size
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✓${NC} Build artifacts created"
    else
        echo -e "${RED}✗${NC} Build artifacts missing"
        ALL_PASSED=false
    fi
else
    echo -e "${RED}✗${NC} Frontend build FAILED"
    ALL_PASSED=false
fi
cd ..

# 4. Check Documentation
run_test "Documentation"
docs=(
    "README.md"
    "SUBMISSION.md"
    "ARCHITECTURE.md"
    "DEPLOYMENT.md"
    "QUICKSTART.md"
    "PROJECT_SUMMARY.md"
    "WAVE1_CHECKLIST.md"
    "FINAL_SUBMISSION_README.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc exists"
    else
        echo -e "${RED}✗${NC} $doc is MISSING"
        ALL_PASSED=false
    fi
done

# 5. Check Contract Files
run_test "Contract Files"
if [ -f "contract/zknda/src/main.leo" ]; then
    echo -e "${GREEN}✓${NC} main.leo exists"
    lines=$(wc -l < contract/zknda/src/main.leo)
    echo "   → $lines lines of code"
else
    echo -e "${RED}✗${NC} main.leo is MISSING"
    ALL_PASSED=false
fi

# 6. Check Frontend Components
run_test "Frontend Components"
components=(
    "frontend/src/App.tsx"
    "frontend/src/components/CreateAgreement.tsx"
    "frontend/src/components/SignAgreement.tsx"
    "frontend/src/components/VerifyAgreement.tsx"
)

for comp in "${components[@]}"; do
    if [ -f "$comp" ]; then
        echo -e "${GREEN}✓${NC} $(basename $comp) exists"
    else
        echo -e "${RED}✗${NC} $(basename $comp) is MISSING"
        ALL_PASSED=false
    fi
done

# 7. Check Styles
run_test "Stylesheets"
styles=(
    "frontend/src/App.css"
    "frontend/src/styles/CreateAgreement.css"
    "frontend/src/styles/SignAgreement.css"
    "frontend/src/styles/VerifyAgreement.css"
)

for style in "${styles[@]}"; do
    if [ -f "$style" ]; then
        echo -e "${GREEN}✓${NC} $(basename $style) exists"
    else
        echo -e "${RED}✗${NC} $(basename $style) is MISSING"
        ALL_PASSED=false
    fi
done

# Final Summary
echo ""
echo "========================================"
echo "Verification Summary"
echo "========================================"

if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your zkNDA Wave 1 submission is ready! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Create GitHub repository"
    echo "2. Push all code"
    echo "3. Submit to Wave Hacks"
    echo ""
    exit 0
else
    echo -e "${RED}✗ SOME CHECKS FAILED${NC}"
    echo ""
    echo "Please fix the issues above before submitting."
    echo ""
    exit 1
fi
