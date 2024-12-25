import {  useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
// import {evmAddress} from "@lens-protocol/client"
// import { fetchAccount } from '@lens-protocol/client/actions';
import {client} from "./client"

const LensAuth = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       console.log(address);
//       const result = await fetchAccount(client, {
//           address: evmAddress(address!),

//       });
//       console.log(result);
//     };

//     if (address) {
//       fetchAccounts();
//     }
//   }, [address]);

  // Handle Lens authentication
  const handleLensLogin = async () => {
    if (!address) return;

    try {
      // Attempt to login as an onboarding user
      const authenticated = await client.login({
        onboardingUser: {
          app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1", // Testnet app address
          wallet: address,
        },
        signMessage: (message: string) => signMessageAsync({ message }),
      });

      if (authenticated.isErr()) {
        throw new Error(authenticated.error.message);
      }

      // Get the session client
      const sessionClient = authenticated.value;
      setIsAuthenticated(true);
      console.log('Successfully authenticated with Lens!', sessionClient);
      
    } catch (err) {
      setError('Failed to authenticate with Lens');
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {address && !isAuthenticated && (
        <button
          onClick={handleLensLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Lens
        </button>
      )}

      {isAuthenticated && (
        <div className="p-2 bg-green-100 text-green-800 rounded">
          Successfully authenticated with Lens!
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default LensAuth;