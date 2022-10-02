import { ChainId, useAddress, useClaimedNFTSupply, useContractMetadata, useMetamask, useNetwork, useNetworkMismatch, useNFTDrop, useUnclaimedNFTSupply } from "@thirdweb-dev/react";
import { useState } from "react";

const contractAddress = "0x983Fa2ccFf0fA9b183473C4512e23315F2d67Cd5";

function App() {
  const [claiming, setClaiming] = useState(false);
  const address = useAddress();
  const connectMetamask = useMetamask();
  const contract = useNFTDrop(contractAddress);
  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { data: contractMetadata } = useContractMetadata(contractAddress);
  const { data: claimedNFTSupply } = useClaimedNFTSupply(contract);
  const { data: unclaimedNFTSupply } = useUnclaimedNFTSupply(contract);

  const mint = async () => {

    // Check if the user has connected
    if (!address) {
      connectMetamask();
      return;
    }

    // Check if the user is on the right network
    if (isWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Goerli);
      return;
    }

    // Claim
    setClaiming(true);
    try {
      await contract?.claim(1);
      alert('minted successfully!!!');
      setClaiming(false);
    } catch (error) {
      alert(error);
      setClaiming(false);
    }
  }

  if (!contract || !contractMetadata) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        loading...
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6 md:p-12">
      <header className="flex flex-col items-center justify-center p-6 md:p-12">
        <p>Minting Page</p>
      </header>
      <main className="grid gap-6 rounded-md bg-black/20 p-6 md:grid-cols-2 md:p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-2xl font-bold text-secondary">
            {contractMetadata?.name}
          </h1>
          <p className="text-center leading-relaxed">
            {contractMetadata?.description}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex w-full max-w-sm flex-col space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-md">
              <img className="aspect-square object-cover" src={contractMetadata?.image} />
            </div>

            <div className="flex max-w-sm justify-between">
              <p>Total Minted</p>
              <p>{claimedNFTSupply?.toNumber()} / {(claimedNFTSupply?.toNumber() || 0) + (unclaimedNFTSupply?.toNumber() || 0)}</p>
            </div>

            <div className="flex justify-center">
              {address && (
                <button className="rounded-full bg-primary px-6 py-2 text-white hover:bg-opacity-75" onClick={mint} disabled={claiming}>
                  {claiming ? 'Claiming...' : 'Mint'}
                </button>
              )}
              {!address && (
                <button className="rounded-full bg-primary px-6 py-2 text-white hover:bg-opacity-75" onClick={connectMetamask}>
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
