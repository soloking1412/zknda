# zkNDA Quick Start Guide

## For Developers

### Setup (5 minutes)

```bash
# Clone and navigate
git clone <repo-url>
cd zknda

# Build contract
cd contract/zknda
leo build

# Run frontend
cd ../../frontend
npm install
npm run dev
```

Open http://localhost:5173

### Test Contract Locally

```bash
cd contract/zknda

# Test create agreement
leo run create_agreement \\
  123456789field \\
  aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc \\
  1000u64

# Output: Agreement record
```

## For Users

### Create an NDA

1. Open zkNDA app
2. Click "Create NDA" tab
3. Enter counter-party's Aleo address
4. Paste your NDA text
5. Click "Create Agreement"
6. Copy and share the link

### Sign an NDA

1. Click the link shared with you
2. Review agreement details
3. Click "Sign Agreement"
4. Confirm in wallet
5. Done! Both parties have proof

### Verify an NDA

1. Click "Verify" tab
2. Paste agreement ID
3. Click "Verify"
4. See signature status

## Key Concepts

### Agreement Hash
- Your NDA text is hashed locally
- Only the hash goes on-chain
- Keep the original text safe!

### Records
- Private to you
- Contain agreement details
- Can't be seen by others

### Verification
- Anyone can verify an agreement exists
- But only parties can see the content
- Perfect balance of privacy and proof

## Need Help?

- 📖 Full docs: See README.md
- 🏗️ Architecture: See ARCHITECTURE.md
- 🚀 Deployment: See DEPLOYMENT.md
- 📝 Submission: See SUBMISSION.md

## Common Issues

**"Wallet not connected"**
→ Install Leo Wallet or Puzzle Wallet browser extension

**"Transaction failed"**
→ Check you have testnet credits

**"Agreement not found"**
→ Verify the agreement ID is correct

---

**That's it! You're ready to use zkNDA 🎉**
