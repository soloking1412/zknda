import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import '../styles/CreateAgreement.css'

export default function CreateAgreement() {
  const { address } = useWallet()
  const [ndaText, setNdaText] = useState('')
  const [partyB, setPartyB] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreementId, setAgreementId] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAddress = (addr: string): boolean => {
    // Aleo addresses start with "aleo1" and are 63 characters long
    if (!addr) {
      setErrors(prev => ({ ...prev, partyB: 'Counter-party address is required' }))
      return false
    }
    if (!addr.startsWith('aleo1')) {
      setErrors(prev => ({ ...prev, partyB: 'Address must start with "aleo1"' }))
      return false
    }
    if (addr.length !== 63) {
      setErrors(prev => ({ ...prev, partyB: 'Address must be exactly 63 characters' }))
      return false
    }
    if (addr === address) {
      setErrors(prev => ({ ...prev, partyB: 'Cannot create agreement with yourself' }))
      return false
    }
    setErrors(prev => ({ ...prev, partyB: '' }))
    return true
  }

  const validateNDA = (text: string): boolean => {
    if (!text || text.trim().length === 0) {
      setErrors(prev => ({ ...prev, ndaText: 'NDA text is required' }))
      return false
    }
    if (text.trim().length < 50) {
      setErrors(prev => ({ ...prev, ndaText: 'NDA text must be at least 50 characters' }))
      return false
    }
    setErrors(prev => ({ ...prev, ndaText: '' }))
    return true
  }

  const handleCreate = async () => {
    // Clear previous errors
    setErrors({})

    // Validate inputs
    const isAddressValid = validateAddress(partyB)
    const isNDAValid = validateNDA(ndaText)

    if (!isAddressValid || !isNDAValid) {
      return
    }

    setLoading(true)
    try {
      // TODO: Integrate with Aleo SDK
      // For Wave 1, we show that wallet is required and validation works
      // Real integration coming in Wave 2

      alert(
        '⚠️ Wave 1 Demo Mode\n\n' +
        'Real blockchain integration coming in Wave 2!\n\n' +
        'For now, this validates inputs and requires wallet connection.\n' +
        'Next wave will include:\n' +
        '- Real agreement creation on Aleo testnet\n' +
        '- Cryptographic hash generation\n' +
        '- On-chain transaction execution'
      )

      // Simulated hash generation (in real version, this would be BHP256 hash)
      const mockAgreementId = 'agreement_' + Math.random().toString(36).substring(7)
      setAgreementId(mockAgreementId)

      const link = `${window.location.origin}?agreement=${mockAgreementId}&tab=sign`
      setShareLink(link)

    } catch (error: any) {
      console.error('Error creating agreement:', error)
      setErrors({ general: error.message || 'Failed to create agreement' })
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="create-agreement">
      <h2>Create New NDA</h2>
      <p className="description">
        Create a privacy-preserving non-disclosure agreement. Only the hash of your NDA will be stored on-chain.
      </p>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <div className="form">
        <div className="form-group">
          <label htmlFor="partyB">Counter-party Address *</label>
          <input
            id="partyB"
            type="text"
            placeholder="aleo1..."
            value={partyB}
            onChange={(e) => {
              setPartyB(e.target.value)
              if (errors.partyB) validateAddress(e.target.value)
            }}
            onBlur={(e) => validateAddress(e.target.value)}
            disabled={loading}
            className={errors.partyB ? 'error' : ''}
          />
          {errors.partyB ? (
            <small className="error-text">{errors.partyB}</small>
          ) : (
            <small>Enter the Aleo address of the other party (63 characters, starts with "aleo1")</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ndaText">NDA Agreement Text *</label>
          <textarea
            id="ndaText"
            rows={15}
            placeholder="Enter your Non-Disclosure Agreement text here...

Example:
This Non-Disclosure Agreement (the 'Agreement') is entered into on [Date] between:

Party A: [Your Information]
Party B: [Counter-party Information]

1. CONFIDENTIAL INFORMATION
Both parties agree to keep confidential any proprietary information shared...

2. OBLIGATIONS
The receiving party agrees to:
- Not disclose confidential information to third parties
- Use confidential information only for the intended purpose
- Protect confidential information with reasonable care

3. TERM
This agreement shall remain in effect for [duration] from the date of signing.

[Add more specific terms as needed]"
            value={ndaText}
            onChange={(e) => {
              setNdaText(e.target.value)
              if (errors.ndaText) validateNDA(e.target.value)
            }}
            onBlur={(e) => validateNDA(e.target.value)}
            disabled={loading}
            className={errors.ndaText ? 'error' : ''}
          />
          {errors.ndaText ? (
            <small className="error-text">{errors.ndaText}</small>
          ) : (
            <small>This text will NOT be stored on-chain, only its cryptographic hash (minimum 50 characters)</small>
          )}
          <div className="char-count">
            {ndaText.length} characters
          </div>
        </div>

        <div className="wallet-info">
          <strong>Your Address:</strong> <code>{address}</code>
        </div>

        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={loading || !ndaText.trim() || !partyB.trim()}
        >
          {loading ? 'Creating...' : 'Create Agreement'}
        </button>
      </div>

      {shareLink && (
        <div className="result">
          <h3>Agreement Created! 🎉</h3>
          <p>Agreement ID: <code>{agreementId}</code></p>
          <div className="share-section">
            <p>Share this link with the counter-party:</p>
            <div className="link-box">
              <input
                type="text"
                value={shareLink}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <button className="btn-copy" onClick={copyLink}>
                Copy
              </button>
            </div>
          </div>
          <div className="info-box warning">
            <p><strong>⚠️ Important - Save Your NDA Text!</strong></p>
            <ul>
              <li>Keep a secure copy of your NDA text</li>
              <li>You'll need it for verification and disputes</li>
              <li>Only the hash is stored on-chain, not the text itself</li>
              <li>If you lose the text, you cannot prove the agreement details</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
