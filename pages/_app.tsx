import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, useAccount, WagmiConfig,} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast';


const { chains, provider } = configureChains(
  [chain.rinkeby],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'SKU LOTTERY',
  chains
});

const wagmiClient = createClient({
  connectors,
  provider
})


function MyApp({ Component, pageProps }: AppProps) {
    return (
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <Component {...pageProps} />
          <Toaster />
        </RainbowKitProvider>
      </WagmiConfig>
    )

}

export default MyApp
