import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'

// Default styles that can be overridden by your app
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css'

const Root = () => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'zkNDA',
      }),
    ],
    [],
  )

  return (
    <StrictMode>
      <WalletProvider
        wallets={wallets}
        decryptPermission={DecryptPermission.OnChainHistory}
        network={WalletAdapterNetwork.TestnetBeta}
        autoConnect
      >
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
