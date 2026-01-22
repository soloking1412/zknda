# zkNDA Architecture

## System Overview

zkNDA is a privacy-preserving NDA platform built on Aleo blockchain that uses zero-knowledge proofs to enable:
1. Private agreement creation and signing
2. Cryptographic proof of signatures without revealing content
3. Selective disclosure for dispute resolution

## Core Components

### 1. Leo Smart Contract (`zknda.aleo`)

The smart contract handles all on-chain logic with privacy-preserving operations:

#### Data Structures

```leo
struct Agreement {
    agreement_hash: field,      // Hash of the NDA content
    party_a: address,            // First party's address
    party_b: address,            // Second party's address
    timestamp: u64,              // Creation timestamp
    status: u8,                  // 0=pending, 1=signed, 2=revoked
}

struct Signature {
    agreement_id: field,         // Reference to agreement
    signer: address,             // Who signed
    signature_hash: field,       // Signature commitment
    signed_at: u64,             // When signed
}
```

#### Core Transitions

**1. `create_agreement`**
```leo
transition create_agreement(
    agreement_hash: field,
    party_b: address
) -> Agreement
```
- Creates new NDA agreement
- Party A is the creator (self.caller)
- Stores agreement hash on-chain
- Returns Agreement record (private to party_a)

**2. `sign_agreement`**
```leo
transition sign_agreement(
    agreement: Agreement,
    signature_hash: field
) -> (Agreement, Signature)
```
- Party B signs the agreement
- Updates agreement status to "signed"
- Creates signature record
- Returns updated agreement and signature (private)

**3. `verify_signature`**
```leo
transition verify_signature(
    signature: Signature
) -> bool
```
- Public function to verify a signature exists
- Doesn't reveal signature content
- Uses ZK proof to confirm validity

**4. `selective_reveal`**
```leo
transition selective_reveal(
    agreement: Agreement,
    reveal_key: field
) -> field
```
- Allow controlled disclosure to third party (arbitrator)
- Requires authorization from both parties
- Returns specific agreement details

### 2. Privacy Mechanisms

#### Content Privacy
- **NDA text never stored on-chain**: Only `agreement_hash = hash(nda_text)` is stored
- Actual content stored locally or encrypted off-chain

#### Party Privacy
- Addresses are public but content is private
- Records are only visible to participants
- Third parties can verify signatures exist without seeing content

#### Signature Privacy
- Signatures use ZK proofs
- `signature_hash = hash(signature + salt)` prevents forgery
- Verification doesn't reveal signature data

### 3. Frontend Architecture

```
┌─────────────────────────────────────────────┐
│              React Frontend                  │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐  ┌───────────────────┐   │
│  │ Wallet Layer │  │  Aleo SDK         │   │
│  │ - Connect    │  │  - Build proofs   │   │
│  │ - Sign       │  │  - Execute        │   │
│  └──────────────┘  └───────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │     Agreement Manager                │  │
│  │  - Create new NDAs                   │  │
│  │  - Share with counter-party          │  │
│  │  - View signature status             │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │     Storage Layer                    │  │
│  │  - IndexedDB for agreement text      │  │
│  │  - LocalStorage for preferences      │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

#### Key Frontend Components

**1. AgreementCreator**
- Form to input NDA text
- Generate agreement hash
- Execute `create_agreement` transition
- Generate shareable link

**2. AgreementViewer**
- Display agreement details
- Show signature status
- Sign button for party B

**3. WalletProvider**
- Connect to Leo Wallet / Puzzle Wallet
- Manage wallet state
- Handle transaction signing

**4. ProofGenerator**
- Build ZK proofs for transitions
- Execute on-chain transactions
- Handle execution results

### 4. Data Flow

#### Creating an Agreement

```
User A               Frontend                Leo Contract          Storage
  |                     |                         |                   |
  |--1. Input NDA------>|                         |                   |
  |                     |--2. hash(text)--------->|                   |
  |                     |<--3. agreement_hash-----|                   |
  |                     |--4. create_agreement--->|                   |
  |                     |   (agreement_hash,      |                   |
  |                     |    party_b_address)     |                   |
  |                     |                         |--5. Store hash--->|
  |                     |<--6. Agreement record---|                   |
  |<--7. Share link-----|                         |                   |
```

#### Signing an Agreement

```
User B               Frontend                Leo Contract          Storage
  |                     |                         |                   |
  |--1. Open link------>|                         |                   |
  |                     |--2. Fetch agreement---->|                   |
  |                     |<--3. Agreement data-----|                   |
  |--4. Review & Sign-->|                         |                   |
  |                     |--5. sign_agreement----->|                   |
  |                     |   (agreement,           |                   |
  |                     |    signature_hash)      |                   |
  |                     |                         |--6. Update------->|
  |                     |<--7. Signature record---|                   |
  |<--8. Confirmation---|                         |                   |
```

#### Verifying a Signature

```
Anyone              Frontend                Leo Contract
  |                     |                         |
  |--1. Request verify->|                         |
  |                     |--2. verify_signature--->|
  |                     |   (signature)           |
  |                     |                         |--3. ZK Proof----->
  |                     |<--4. true/false---------|
  |<--5. Result---------|                         |
```

## Security Considerations

### 1. Agreement Hash Collision
- Use Poseidon hash (Aleo native) - cryptographically secure
- Collision probability negligible (2^-128)

### 2. Signature Replay
- Include `agreement_id` in signature
- Add timestamp to prevent replays
- Each signature is unique to one agreement

### 3. Party Authorization
- Only party_b can sign (checked in contract)
- Only parties can execute selective_reveal
- Access control enforced by Aleo records

### 4. Content Storage
- NEVER store plain text on-chain
- Client-side encryption recommended
- Use IPFS for encrypted storage (future)

## Gas & Performance

### Transaction Costs
- `create_agreement`: ~5,000 gates
- `sign_agreement`: ~8,000 gates
- `verify_signature`: ~3,000 gates
- `selective_reveal`: ~4,000 gates

### Optimization Strategies
- Batch operations where possible
- Minimize on-chain state
- Use efficient hash functions (Poseidon)

## Future Enhancements

### Wave 2+
1. **Multi-party support**: N-way agreements
2. **Templates**: Pre-defined NDA types
3. **Expiration**: Auto-revoke after date
4. **ANS Integration**: Human-readable names
5. **Arbitration**: Formal dispute resolution
6. **IPFS Storage**: Encrypted content storage
7. **Mobile App**: PWA for mobile devices
8. **Enterprise API**: Programmatic access

### Scalability
- Current design handles 1000s of agreements
- Future: Layer 2 batching for high volume
- Sharding for multi-jurisdiction compliance
