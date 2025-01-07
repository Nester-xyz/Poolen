
import { useSessionClient } from '../context/sessionContext';
import { useBalance } from 'wagmi';

function ProfileBalance() {
  const {
    activeLensAddress
  } = useSessionClient()
  const { data: balance, isError, isLoading } = useBalance({
    address: activeLensAddress, // Address of the smart contract
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching balance</div>;

  return (
    <div>
      Contract Balance: {balance?.formatted} {balance?.symbol}
    </div>
  );
}

export default ProfileBalance;
