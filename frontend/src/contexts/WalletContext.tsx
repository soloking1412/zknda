import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface WalletContextType {
  connected: boolean
  address: string | null
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      // Check for Leo Wallet or other Aleo wallets
      if (typeof window !== 'undefined' && (window as any).leoWallet) {
        const wallet = (window as any).leoWallet
        const accounts = await wallet.getAccounts()
        if (accounts && accounts.length > 0) {
          setConnected(true)
          setAddress(accounts[0])
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err)
    }
  }

  const connect = async () => {
    setConnecting(true)
    setError(null)

    try {
      // Check if Leo Wallet is installed
      if (typeof window === 'undefined' || !(window as any).leoWallet) {
        throw new Error(
          'Leo Wallet not found. Please install Leo Wallet extension from https://leo.app/'
        )
      }

      const wallet = (window as any).leoWallet

      // Request connection
      const accounts = await wallet.requestAccounts()

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in Leo Wallet.')
      }

      setConnected(true)
      setAddress(accounts[0])
      setError(null)
    } catch (err: any) {
      console.error('Error connecting wallet:', err)
      setError(err.message || 'Failed to connect wallet')
      setConnected(false)
      setAddress(null)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    setError(null)
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        connecting,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
