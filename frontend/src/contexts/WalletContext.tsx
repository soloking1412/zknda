import { type FC, type ReactNode } from 'react'
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base'
import { useMemo } from 'react'

// Import styles
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css'

export const AleoWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'zkNDA',
      }),
    ],
    []
  )

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect={false}
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  )
}

// Re-export the useWallet hook for convenience
export { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
