import { configureChains, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })],
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})
