# zkNDA Deployment Guide

## Prerequisites

- Leo 3.4.0+ installed (`leo --version`)
- Aleo account with testnet credits
- Node.js 18+ for frontend

## Step 1: Deploy Leo Contract to Testnet

### 1.1 Configure Network

```bash
cd contract/zknda
```

Create or edit `program.json`:

```json
{
  "program": "zknda.aleo",
  "version": "0.0.0",
  "description": "Privacy-Preserving NDAs",
  "development": {
    "private_key": "YOUR_PRIVATE_KEY",
    "endpoint": "https://api.explorer.provable.com/v1"
  },
  "license": "MIT"
}
```

### 1.2 Build Contract

```bash
leo build
```

Expected output:
```
✅ Compiled 'zknda.aleo' into Aleo instructions
```

### 1.3 Deploy to Testnet

```bash
leo deploy --network testnet --endpoint https://api.explorer.provable.com/v1
```

This will:
1. Upload program to Aleo testnet
2. Execute the constructor
3. Return program ID

**Save the program ID** - you'll need it for frontend integration.

### 1.4 Verify Deployment

Check your program on the explorer:
```
https://explorer.provable.com/program/zknda.aleo
```

## Step 2: Test Contract Functions

### 2.1 Create Agreement

```bash
leo run create_agreement \\
  123456789field \\  # agreement_hash
  aleo1... \\        # party_b address
  1000u64          # timestamp
```

### 2.2 Sign Agreement

```bash
leo run sign_agreement \\
  "{
    owner: aleo1...,
    agreement_id: 123field,
    agreement_hash: 456field,
    party_a: aleo1...,
    party_b: aleo1...,
    created_at: 1000u64,
    status: 0u8
  }" \\
  1001u64  # current timestamp
```

### 2.3 Verify Agreement

```bash
leo run verify_agreement_exists 123field
```

## Step 3: Deploy Frontend

### 3.1 Install Dependencies

```bash
cd ../../frontend
npm install
```

### 3.2 Configure Environment

Create `.env` file:

```env
VITE_PROGRAM_ID=zknda.aleo
VITE_NETWORK=testnet
VITE_API_URL=https://api.explorer.provable.com/v1
```

### 3.3 Build Frontend

```bash
npm run build
```

Output will be in `dist/` directory.

### 3.4 Deploy Frontend

#### Option A: Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Option B: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option C: GitHub Pages

```bash
# Push dist/ to gh-pages branch
git subtree push --prefix frontend/dist origin gh-pages
```

## Step 4: Integration Testing

### 4.1 Test Create Flow

1. Open deployed frontend
2. Connect wallet
3. Go to "Create NDA" tab
4. Fill in counter-party address
5. Enter NDA text
6. Click "Create Agreement"
7. Verify transaction succeeds
8. Copy share link

### 4.2 Test Sign Flow

1. Open share link (different wallet)
2. Click "Load Agreement"
3. Review details
4. Click "Sign Agreement"
5. Confirm transaction
6. Verify success message

### 4.3 Test Verify Flow

1. Go to "Verify" tab
2. Enter agreement ID
3. Click "Verify"
4. Confirm agreement shown as signed

## Troubleshooting

### Contract Issues

**Error: "Program already exists"**
- Solution: Change program name in `program.json`

**Error: "Insufficient credits"**
- Solution: Request testnet credits from faucet

**Build fails with syntax error**
- Solution: Verify Leo version: `leo --version` (should be 3.4.0+)

### Frontend Issues

**Wallet won't connect**
- Ensure wallet extension is installed
- Check network is set to testnet
- Try refreshing page

**Transactions fail**
- Verify wallet has credits
- Check program ID in `.env`
- Ensure contract is deployed

## Production Checklist

Before mainnet:

- [ ] Security audit of smart contract
- [ ] Gas optimization
- [ ] Frontend security review
- [ ] Load testing
- [ ] Error handling improvements
- [ ] Comprehensive integration tests
- [ ] User documentation
- [ ] Privacy policy
- [ ] Terms of service

## Monitoring

### Contract Monitoring

Check contract activity:
```bash
curl https://api.explorer.provable.com/v1/program/zknda.aleo/transactions
```

### Frontend Monitoring

Use services like:
- Vercel Analytics
- Google Analytics
- Sentry for error tracking

## Backup & Recovery

### Backup Private Keys

```bash
# Export your deployment key
leo account export > deployment-key-backup.txt

# Store securely (encrypted, offline)
```

### Backup Agreement Records

Users should:
1. Export their Agreement records
2. Save NDA text locally
3. Keep transaction hashes

## Support

For issues:
1. Check logs: `leo clean && leo build`
2. Review documentation
3. Contact on Discord: [your-discord]
4. GitHub Issues: [repo-url]/issues

---

**Security Note**: Never commit private keys or `.env` files to version control.
