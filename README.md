# zkNDA - Private Non-Disclosure Agreements

A privacy-preserving NDA platform built on Aleo that enables parties to prove agreement signatures without revealing content.

## 🎯 Problem

Current NDA solutions are either:
- **Paper/PDFs**: No enforcement, no proof, easy to forge
- **DocuSign/HelloSign**: Centralized, expensive, no privacy
- **Blockchain solutions**: Everything is PUBLIC - your deals are visible to competitors

## ✨ Solution

zkNDA leverages Aleo's zero-knowledge proofs to provide:
- ✅ **Cryptographic proof** that both parties signed
- ✅ **Encrypted content** - only signatories can read the NDA
- ✅ **Timestamped** - immutable proof of when agreement was made
- ✅ **Selective disclosure** - reveal to arbitrator without making public

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  React + Aleo SDK
│   (React App)   │  - Agreement creation UI
└────────┬────────┘  - Wallet connection
         │           - ZK proof generation
         │
         ▼
┌─────────────────┐
│  Leo Contract   │  Privacy-preserving logic
│   (zknda.aleo)  │  - create_agreement()
└─────────────────┘  - sign_agreement()
                     - verify_signature()
                     - selective_reveal()
```

## 🚀 Quick Start

### Prerequisites
- Leo compiler (`leo --version`)
- Node.js v18+ (`node --version`)
- Aleo wallet (Leo Wallet or Puzzle Wallet)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd zknda

# Install Leo contract dependencies
cd contract
leo build

# Install frontend dependencies
cd ../frontend
npm install
npm run dev
```

## 📝 Usage

1. **Create Agreement**: Connect wallet, paste NDA text, generate agreement hash
2. **Share Link**: Send secure link to counter-party
3. **Sign Agreement**: Counter-party reviews and signs with their wallet
4. **Proof Generated**: Both parties receive cryptographic proof of signature

## 🔒 Privacy Features

- **Agreement Content**: Never stored on-chain, only hash
- **Party Identities**: Represented as commitments, not public addresses
- **Signatures**: ZK proofs verify without revealing private keys
- **Selective Reveal**: Arbitrator can verify specific details without full disclosure

## 🛠️ Technology Stack

- **Smart Contract**: Leo (Aleo programming language)
- **Frontend**: React + Vite + TailwindCSS
- **Blockchain**: Aleo testnet
- **Wallet Integration**: Aleo SDK

## 📋 Roadmap

### Wave 1 (MVP) ✅
- [x] Core Leo contract (create, sign, verify)
- [x] Basic React frontend
- [x] Wallet connection
- [ ] Deploy to testnet

### Wave 2-10 (Progressive Enhancement)
- [ ] Multi-party NDAs (3+ signatories)
- [ ] Template library
- [ ] Expiration dates
- [ ] ANS integration
- [ ] Arbitration mechanism
- [ ] Mobile PWA
- [ ] Enterprise API
- [ ] Mainnet deployment
- [ ] Analytics dashboard

## 🏆 Wave Hacks Submission

Built for [Aleo Wave Hacks Buildathon](https://app.akindo.io/wave-hacks/gXdXJvJXxTJKBELvo) on AKINDO.

### Judging Criteria Alignment

| Criteria | Implementation |
|----------|---------------|
| **Privacy Usage (40%)** | Core feature - ZK proofs for signatures, encrypted content, private party identities |
| **Technical Implementation (20%)** | Clean Leo contracts with proper ZK circuits |
| **User Experience (20%)** | Simple 3-step wizard, no crypto complexity |
| **Practicality (10%)** | Solves real business need - NDAs are universal |
| **Novelty (10%)** | First privacy-preserving NDA solution in crypto |

## 📄 License

MIT License

## 🤝 Contributing

This is a buildathon project. Contributions welcome after Wave 1 submission!

## 📧 Contact

Built by [@soloking] for Aleo Wave Hacks 2026
