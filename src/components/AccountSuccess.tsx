import { CircleCheck, LogOut } from 'lucide-react';

interface AccountSuccessProps {
  username: string;
}

const AccountSuccess = ({ username }: AccountSuccessProps) => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-green-100 p-3">
          <CircleCheck className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <div className="text-xl font-medium text-black">Successfully logged in!</div>
          <p className="text-gray-500">as <span className="font-semibold text-green-600">{username}</span></p>
        </div>
        
      </div>
      
    </div>
  );
};

export default AccountSuccess;