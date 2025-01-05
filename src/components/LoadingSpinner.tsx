type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large';
};

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="h-full w-full border-4 border-gray-200 rounded-full border-t-blue-500" />
    </div>
  );
};

export default LoadingSpinner;
