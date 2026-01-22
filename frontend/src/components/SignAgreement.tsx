import { useState, useEffect } from 'react'
import '../styles/SignAgreement.css'

export default function SignAgreement() {
  const [agreementId, setAgreementId] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreementDetails, setAgreementDetails] = useState<any>(null)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    // Check if there's an agreement ID in the URL
    const params = new URLSearchParams(window.location.search)
    const agreementParam = params.get('agreement')
    if (agreementParam) {
      setAgreementId(agreementParam)
      loadAgreement(agreementParam)
    }
  }, [])

  const loadAgreement = async (id: string) => {
    setLoading(true)
    try {
      // TODO: Fetch agreement details from blockchain
      // For now, use mock data
      setAgreementDetails({
        id,
        partyA: 'aleo1... (truncated)',
        createdAt: new Date().toISOString(),
        status: 'Pending',
      })
    } catch (error) {
      console.error('Error loading agreement:', error)
      alert('Failed to load agreement')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async () => {
    if (!agreementId) {
      alert('Please enter an agreement ID')
      return
    }

    setLoading(true)
    try {
      // TODO: Integrate with Aleo SDK
      // 1. Verify user is party_b
      // 2. Call sign_agreement transition
      // 3. Update UI

      // Simulated for now
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSigned(true)
      alert('Agreement signed successfully!')
    } catch (error) {
      console.error('Error signing agreement:', error)
      alert('Failed to sign agreement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sign-agreement">
      <h2>Sign NDA</h2>
      <p className="description">
        Sign a pending NDA agreement. You must be the designated counter-party.
      </p>

      <div className="form">
        <div className="form-group">
          <label htmlFor="agreementId">Agreement ID</label>
          <input
            id="agreementId"
            type="text"
            placeholder="Enter agreement ID..."
            value={agreementId}
            onChange={(e) => setAgreementId(e.target.value)}
            disabled={loading}
          />
        </div>

        {!agreementDetails && (
          <button
            className="btn-secondary"
            onClick={() => loadAgreement(agreementId)}
            disabled={loading || !agreementId.trim()}
          >
            {loading ? 'Loading...' : 'Load Agreement'}
          </button>
        )}
      </div>

      {agreementDetails && !signed && (
        <div className="agreement-preview">
          <h3>Agreement Details</h3>
          <div className="details-grid">
            <div className="detail">
              <label>Agreement ID:</label>
              <code>{agreementDetails.id}</code>
            </div>
            <div className="detail">
              <label>Created By (Party A):</label>
              <code>{agreementDetails.partyA}</code>
            </div>
            <div className="detail">
              <label>Created At:</label>
              <code>{new Date(agreementDetails.createdAt).toLocaleString()}</code>
            </div>
            <div className="detail">
              <label>Status:</label>
              <span className={`status status-${agreementDetails.status.toLowerCase()}`}>
                {agreementDetails.status}
              </span>
            </div>
          </div>

          <div className="info-box warning">
            <p><strong>⚠️ Before Signing:</strong></p>
            <ul>
              <li>Verify the agreement ID matches what was shared with you</li>
              <li>Ensure you've read and understood the NDA terms</li>
              <li>Confirm the creator's address (Party A)</li>
              <li>This action cannot be undone without mutual revocation</li>
            </ul>
          </div>

          <button
            className="btn-primary btn-sign"
            onClick={handleSign}
            disabled={loading}
          >
            {loading ? 'Signing...' : '✍️ Sign Agreement'}
          </button>
        </div>
      )}

      {signed && (
        <div className="result success">
          <h3>✅ Agreement Signed Successfully!</h3>
          <p>Your signature has been recorded on the Aleo blockchain.</p>
          <div className="info-box">
            <p>Both parties now have proof of this agreement.</p>
            <p>The agreement details remain private to you and the other party.</p>
          </div>
        </div>
      )}
    </div>
  )
}
