import { useState } from 'react'
import '../styles/VerifyAgreement.css'

export default function VerifyAgreement() {
  const [agreementId, setAgreementId] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleVerify = async () => {
    if (!agreementId.trim()) {
      alert('Please enter an agreement ID')
      return
    }

    setLoading(true)
    try {
      // TODO: Integrate with Aleo SDK
      // 1. Call verify_agreement_exists transition
      // 2. Call verify_signature transition
      // 3. Show results

      // Simulated for now
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setVerificationResult({
        exists: true,
        signed: true,
        partyA: 'aleo1... (truncated)',
        partyB: 'aleo1... (truncated)',
        signedAt: new Date().toISOString(),
        status: 'Active',
      })
    } catch (error) {
      console.error('Error verifying agreement:', error)
      setVerificationResult({
        exists: false,
        error: 'Agreement not found or not signed',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="verify-agreement">
      <h2>Verify Agreement</h2>
      <p className="description">
        Verify that an NDA agreement exists and has been signed by both parties.
      </p>

      <div className="form">
        <div className="form-group">
          <label htmlFor="agreementId">Agreement ID</label>
          <input
            id="agreementId"
            type="text"
            placeholder="Enter agreement ID to verify..."
            value={agreementId}
            onChange={(e) => setAgreementId(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleVerify}
          disabled={loading || !agreementId.trim()}
        >
          {loading ? 'Verifying...' : '🔍 Verify'}
        </button>
      </div>

      {verificationResult && (
        <div className={`result ${verificationResult.exists ? 'success' : 'error'}`}>
          {verificationResult.exists ? (
            <>
              <h3>✅ Agreement Verified</h3>
              <div className="verification-details">
                <div className="detail-row">
                  <span className="label">Agreement ID:</span>
                  <code>{agreementId}</code>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`badge badge-${verificationResult.status.toLowerCase()}`}>
                    {verificationResult.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Party A:</span>
                  <code>{verificationResult.partyA}</code>
                </div>
                <div className="detail-row">
                  <span className="label">Party B:</span>
                  <code>{verificationResult.partyB}</code>
                </div>
                <div className="detail-row">
                  <span className="label">Signed:</span>
                  <span className={verificationResult.signed ? 'text-success' : 'text-warning'}>
                    {verificationResult.signed ? '✓ Yes' : '⚠️ Pending'}
                  </span>
                </div>
                {verificationResult.signed && (
                  <div className="detail-row">
                    <span className="label">Signed At:</span>
                    <span>{new Date(verificationResult.signedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="info-box">
                <h4>What This Means:</h4>
                <ul>
                  <li>✅ This agreement exists on the Aleo blockchain</li>
                  <li>✅ Both parties have cryptographically signed the agreement</li>
                  <li>✅ The agreement cannot be forged or tampered with</li>
                  <li>🔒 Agreement content remains private to the parties</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h3>❌ Verification Failed</h3>
              <p>{verificationResult.error}</p>
              <div className="info-box warning">
                <p>Possible reasons:</p>
                <ul>
                  <li>Agreement ID doesn't exist</li>
                  <li>Agreement hasn't been signed yet</li>
                  <li>Agreement has been revoked</li>
                  <li>Invalid agreement ID format</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      <div className="info-section">
        <h3>About Verification</h3>
        <p>
          Our verification system uses zero-knowledge proofs to confirm that an agreement exists
          and has been signed, without revealing the agreement's content.
        </p>
        <p>
          Anyone can verify an agreement's existence and signature status, but only the parties
          involved can access the actual NDA content.
        </p>
      </div>
    </div>
  )
}
