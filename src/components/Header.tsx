import { shortenIntoTwoParts } from "@/utils/shorten"
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi"

export const Header = () => {
  const { address, isConnected, connector } = useAccount()
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  })
  const { disconnect } = useDisconnect()
    const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  const connectButton = (
    <div>
      {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button style={{ margin: 16 }} key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
            </button>
          ))}
    </div>
  )

  const disconnectButton = (
  <div style={{ display: 'flex', alignItems: 'end' }}>
    <button style={{ margin: 16 }} onClick={() => disconnect()}>
      Disconnect
    </button>
    </div>
  )

  const balanceSection = (
    <div>
      <p>Balance: {balanceLoading ? 'Loading...' : `${balance?.formatted} ${balance?.symbol}`}</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100vw', padding: '8px 24px' }}>
      {isConnected ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <p>{shortenIntoTwoParts(address)}</p>
            {balanceSection}
          </div>
          {disconnectButton}
        </>
      ) : connectButton}
    </div>
  )
}
