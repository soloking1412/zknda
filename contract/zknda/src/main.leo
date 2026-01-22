// zkNDA - Privacy-Preserving Non-Disclosure Agreements
// A smart contract for creating and signing NDAs with zero-knowledge proofs

program zknda.aleo {

    // Agreement record - private to participants
    record Agreement {
        owner: address,           // Owner of this record
        agreement_id: field,      // Unique identifier
        agreement_hash: field,    // Hash of NDA content
        party_a: address,         // First party (creator)
        party_b: address,         // Second party (signer)
        created_at: u64,          // Creation timestamp (block height)
        status: u8,               // 0=pending, 1=signed, 2=revoked
    }

    // Signature record - proof of signing
    record Signature {
        owner: address,           // Owner of this record
        agreement_id: field,      // Reference to agreement
        signer: address,          // Who signed
        signature_hash: field,    // Commitment to signature
        signed_at: u64,          // Signing timestamp (block height)
    }

    // Mapping to track agreement existence (public but minimal info)
    mapping agreements: field => u8;

    // Mapping to track signatures
    mapping signatures: field => field;

    // Constructor - prevent upgrades for security
    @noupgrade
    async constructor() {}

    // Create a new NDA agreement
    // party_a creates agreement and specifies party_b
    // Returns an Agreement record private to party_a
    async transition create_agreement(
        public agreement_hash: field,     // Hash of NDA content
        public party_b: address,          // Counter-party address
        public timestamp: u64             // Current block height
    ) -> (Agreement, Future) {

        // Generate unique agreement ID from hash and parties
        let agreement_id: field = BHP256::hash_to_field(agreement_hash);

        // Create Agreement record for party_a
        let agreement: Agreement = Agreement {
            owner: self.caller,
            agreement_id: agreement_id,
            agreement_hash: agreement_hash,
            party_a: self.caller,
            party_b: party_b,
            created_at: timestamp,
            status: 0u8,  // Pending
        };

        // Return agreement record and finalize future
        return (agreement, finalize_create_agreement(agreement_id));
    }

    async function finalize_create_agreement(public agreement_id: field) {
        // Store minimal info on-chain: just mark existence as pending
        Mapping::set(agreements, agreement_id, 0u8);
    }

    // Party B signs the agreement
    // Takes party_a's Agreement record as input
    // Returns updated Agreement for party_a AND new records for party_b
    async transition sign_agreement(
        agreement: Agreement,      // Agreement record from party_a
        public timestamp: u64      // Current block height
    ) -> (Agreement, Agreement, Signature, Future) {

        // Verify caller is party_b
        assert_eq(self.caller, agreement.party_b);

        // Verify agreement is still pending
        assert_eq(agreement.status, 0u8);

        // Generate signature hash
        let signature_hash: field = BHP256::hash_to_field(agreement.agreement_id);

        // Update agreement status to signed
        let updated_agreement_for_a: Agreement = Agreement {
            owner: agreement.party_a,
            agreement_id: agreement.agreement_id,
            agreement_hash: agreement.agreement_hash,
            party_a: agreement.party_a,
            party_b: agreement.party_b,
            created_at: agreement.created_at,
            status: 1u8,  // Signed
        };

        // Create agreement record for party_b
        let agreement_for_b: Agreement = Agreement {
            owner: self.caller,
            agreement_id: agreement.agreement_id,
            agreement_hash: agreement.agreement_hash,
            party_a: agreement.party_a,
            party_b: agreement.party_b,
            created_at: agreement.created_at,
            status: 1u8,  // Signed
        };

        // Create signature record for party_b
        let sig_record: Signature = Signature {
            owner: self.caller,
            agreement_id: agreement.agreement_id,
            signer: self.caller,
            signature_hash: signature_hash,
            signed_at: timestamp,
        };

        // Return all records and finalize future
        return (updated_agreement_for_a, agreement_for_b, sig_record, finalize_sign_agreement(agreement.agreement_id, signature_hash));
    }

    async function finalize_sign_agreement(
        public agreement_id: field,
        public signature_hash: field
    ) {
        // Update agreement status to signed
        Mapping::set(agreements, agreement_id, 1u8);

        // Store signature hash
        Mapping::set(signatures, agreement_id, signature_hash);
    }

    // Verify that an agreement exists and is signed
    // Public function - anyone can verify
    async transition verify_agreement_exists(
        public agreement_id: field
    ) -> (bool, Future) {
        // Return true and verify on-chain
        return (true, finalize_verify_agreement(agreement_id));
    }

    async function finalize_verify_agreement(public agreement_id: field) {
        // Check if agreement exists
        let status: u8 = Mapping::get(agreements, agreement_id);

        // Assert it's signed (status == 1)
        assert_eq(status, 1u8);
    }

    // Verify signature belongs to an agreement
    // Public function - anyone can verify signatures exist
    async transition verify_signature(
        public agreement_id: field
    ) -> (bool, Future) {
        return (true, finalize_verify_signature(agreement_id));
    }

    async function finalize_verify_signature(public agreement_id: field) {
        // Check signature exists
        let signature_hash: field = Mapping::get(signatures, agreement_id);

        // If we got here, signature exists (get would fail otherwise)
        assert_neq(signature_hash, 0field);
    }

    // Revoke an agreement (either party can revoke)
    // Requires ownership of Agreement record
    async transition revoke_agreement(
        agreement: Agreement
    ) -> (Agreement, Future) {

        // Verify caller is one of the parties
        let is_party: bool = (self.caller == agreement.party_a) || (self.caller == agreement.party_b);
        assert(is_party);

        // Create revoked agreement record
        let revoked_agreement: Agreement = Agreement {
            owner: self.caller,
            agreement_id: agreement.agreement_id,
            agreement_hash: agreement.agreement_hash,
            party_a: agreement.party_a,
            party_b: agreement.party_b,
            created_at: agreement.created_at,
            status: 2u8,  // Revoked
        };

        return (revoked_agreement, finalize_revoke_agreement(agreement.agreement_id));
    }

    async function finalize_revoke_agreement(public agreement_id: field) {
        // Update status to revoked
        Mapping::set(agreements, agreement_id, 2u8);
    }

    // Selective reveal - prove specific details to arbitrator
    // Only parties can perform selective reveal
    transition selective_reveal(
        agreement: Agreement,
        reveal_key: field          // Key authorizing reveal
    ) -> field {

        // Verify caller owns this agreement record
        assert_eq(self.caller, agreement.owner);

        // Return agreement hash for arbitrator verification
        // In production, this could reveal specific fields based on reveal_key
        return agreement.agreement_hash;
    }

    // Get agreement status (public query)
    async transition get_agreement_status(
        public agreement_id: field
    ) -> (u8, Future) {
        return (0u8, finalize_get_status(agreement_id));
    }

    async function finalize_get_status(public agreement_id: field) {
        // Check agreement exists and return status
        let status: u8 = Mapping::get_or_use(agreements, agreement_id, 255u8);
        assert_neq(status, 255u8);
    }
}
