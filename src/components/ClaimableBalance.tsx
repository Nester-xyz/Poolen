import { useMemeMelee } from "../hooks/useMemeMelee";
import { useSessionClient } from "../context/sessionContext";

const ClaimableBalance = () => {
    const { claimBalanceLens } = useMemeMelee();
    const { activeLensAddress } = useSessionClient();

    
    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Claimable Balance</h2>
                
            </div>
            <button
                onClick={() => claimBalanceLens()}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200`}
            >
                {activeLensAddress ? 'Claim via Lens' : 'Claim Rewards'}
            </button>
        </div>
    );
};

export default ClaimableBalance;
