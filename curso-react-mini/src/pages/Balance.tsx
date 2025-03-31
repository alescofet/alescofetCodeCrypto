import { FormEvent, useEffect, useState } from 'react'

import { ethers } from 'ethers'

function Balance() {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txStatus, setTxStatus] = useState('')
  const [txLoading, setTxLoading] = useState(false)

  const connectWallet = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const account = accounts[0]
      setAccount(account)

      const balance = await provider.getBalance(account)
      setBalance(ethers.formatEther(balance))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        connectWallet()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet)
      }
    }
  }, [])

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col text-center">
          <h1>Balance ETH</h1>
        </div>
      </div>

      {error && (
        <div className="row mb-4">
          <div className="col">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col text-center">
          {!account ? (
            <button 
              className="btn btn-primary" 
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
          ) : (
            <div>
              <p className="mb-2">Account: <span className="font-monospace">{account}</span></p>
              <p className="mb-4">Balance: <span className="font-monospace">{balance} ETH</span></p>
              
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Send ETH</h5>
                  <form onSubmit={async (e: FormEvent) => {
                    e.preventDefault()
                    if (!window.ethereum) return
                    
                    try {
                      setTxLoading(true)
                      setTxStatus('')
                      setError('')

                      const provider = new ethers.BrowserProvider(window.ethereum)
                      const signer = await provider.getSigner()
                      
                      const tx = await signer.sendTransaction({
                        to: recipient,
                        value: ethers.parseEther(amount)
                      })

                      setTxStatus(`Transaction sent! Hash: ${tx.hash}`)
                      setRecipient('')
                      setAmount('')
                      
                      await tx.wait()
                      const newBalance = await provider.getBalance(account)
                      setBalance(ethers.formatEther(newBalance))
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Transaction failed')
                    } finally {
                      setTxLoading(false)
                    }
                  }}>
                    <div className="mb-3">
                      <label htmlFor="recipient" className="form-label">Recipient Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        placeholder="0x..."
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">Amount (ETH)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        step="any"
                        min="0"
                        max={parseFloat(balance)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={txLoading}
                    >
                      {txLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        'Send ETH'
                      )}
                    </button>
                  </form>
                  
                  {txStatus && (
                    <div className="alert alert-success mt-3" role="alert">
                      {txStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Balance