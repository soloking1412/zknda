import { useState } from 'react'
import './App.css'
import CreateAgreement from './components/CreateAgreement'
import SignAgreement from './components/SignAgreement'
import VerifyAgreement from './components/VerifyAgreement'
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'sign' | 'verify'>('create')
  const { connected } = useWallet()

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>zkNDA</h1>
            <p className="tagline">Privacy-Preserving NDAs on Aleo</p>
          </div>
          <div className="wallet-section">
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <main className="main">
        {!connected && (
          <div className="wallet-required-notice">
            <div className="notice-icon">🔐</div>
            <h3>Wallet Connection Required</h3>
            <p>Please connect your Aleo wallet to use zkNDA.</p>
            <p className="notice-small">
              Don't have a wallet? Install{' '}
              <a href="https://leo.app/" target="_blank" rel="noopener noreferrer">
                Leo Wallet
              </a>{' '}
              or{' '}
              <a href="https://puzzle.online/" target="_blank" rel="noopener noreferrer">
                Puzzle Wallet
              </a>
            </p>
          </div>
        )}

        {connected && (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                Create NDA
              </button>
              <button
                className={`tab ${activeTab === 'sign' ? 'active' : ''}`}
                onClick={() => setActiveTab('sign')}
              >
                Sign NDA
              </button>
              <button
                className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
                onClick={() => setActiveTab('verify')}
              >
                Verify
              </button>
            </div>

            <div className="content">
              {activeTab === 'create' && <CreateAgreement />}
              {activeTab === 'sign' && <SignAgreement />}
              {activeTab === 'verify' && <VerifyAgreement />}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Built with Aleo for Wave Hacks 2026</p>
        <p className="privacy-note">
          🔒 Your NDA content is never stored on-chain. Only cryptographic hashes are recorded.
        </p>
      </footer>
    </div>
  )
}

export default App
