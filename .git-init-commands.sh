#!/bin/bash

# zkNDA - Git Initialization Commands
# Run these commands to push to GitHub

echo "🚀 zkNDA Git Setup"
echo "==================="
echo ""

# Check if already initialized
if [ -d ".git" ]; then
    echo "✓ Git already initialized"
else
    echo "Initializing Git repository..."
    git init
    echo "✓ Git initialized"
fi

echo ""
echo "Adding files..."
git add .
echo "✓ Files added"

echo ""
echo "Creating commit..."
git commit -m "Initial commit: zkNDA Wave 1 submission

Features:
- Privacy-preserving NDA smart contract in Leo
- React frontend with wallet integration  
- Complete input validation
- Comprehensive documentation

Wave 1 deliverables:
✅ Leo contract (220 lines)
✅ React frontend with validation
✅ Wallet connection integration
✅ 9 documentation files
✅ Production-ready foundation"

echo ""
echo "✓ Commit created"
echo ""
echo "==================="
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run these commands (replace YOUR_USERNAME):"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/zknda.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "==================="
