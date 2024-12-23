import { WagmiProvider, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createStorage } from "wagmi";
const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    storage:  createStorage({ storage: window.localStorage,}),
    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "Poolen",
  }),
);


const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};