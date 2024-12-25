import { WagmiProvider, createConfig } from "wagmi";
import { Chain } from "wagmi/chains";
// import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createStorage } from "wagmi";

const lensTestnet: Chain = {
  id: 37111, // Chain ID for Lens Network Sepolia Testnet
  name: "Lens Network Sepolia Testnet",

  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.lens.dev"],
    },
    public: {
      http: ["https://rpc.testnet.lens.dev"],
    }
  },
  nativeCurrency: {
    name: "GRASS",
    symbol: "GRASS",
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "Lens Testnet Explorer",
      url: "https://block-explorer.testnet.lens.dev",
    },
  },
};
const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [lensTestnet],
    storage: createStorage({ storage: window.localStorage, }),
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
