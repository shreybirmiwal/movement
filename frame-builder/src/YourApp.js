import { useAccount, useNetwork } from 'wagmi';

export const YourApp = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div>
      <p>
        wagmi connected: {isConnected ? 'true' : 'false'}
      </p>
      <p>wagmi address: {address}</p>
      <p>wagmi network: {chain?.id}</p>
    </div>
  );
};
