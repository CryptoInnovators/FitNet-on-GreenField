'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    bscGreenfield,
    bscTestnet
} from 'wagmi/chains';
import { greenFieldChain } from '@/config/wallet';

const { wallets } = getDefaultWallets();

// const config = getDefaultConfig({
//   appName: 'RainbowKit demo',
//   projectId: 'YOUR_PROJECT_ID',
//   wallets: [
//     ...wallets,
//     {
//       groupName: 'Other',
//       wallets: [argentWallet, trustWallet, ledgerWallet],
//     },
//   ],
//   chains: [
//     mainnet,
//     polygon,
//     optimism,
//     arbitrum,
//     base,
//     ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
//   ],
//   ssr: true,
// });


const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [bscTestnet, greenFieldChain],
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}