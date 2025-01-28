import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const main = async () => {
  const APTOS_NETWORK: Network = Network.DEVNET;
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);

  const alice = Account.generate();

  console.log("=== Addresses ===\n");
  console.log(`Alice's address is: ${alice.accountAddress}`);

  await aptos.fundAccount({
    accountAddress: alice.accountAddress,
    amount: 100_000_000,
  });

  console.log("\n=== Creating collection ===\n");

  const collectionName = "Collection ng mama mo";
  const collectionDescription = "Example description.";
  const collectionURI = "https://i.imgur.com/2CEXL1w.png";

  const createCollectionTransaction = await aptos.createCollectionTransaction({
    creator: alice,
    description: collectionDescription,
    name: collectionName,
    uri: collectionURI,
  });

  const commitedCreateCollectionTx = await aptos.signAndSubmitTransaction({
    signer: alice,
    transaction: createCollectionTransaction,
  });

  console.log(commitedCreateCollectionTx);

  const tokenName = "Selyo NFT";
  const tokenDescription = "Bahog Bilat";
  const tokenURI = "https://i.imgur.com/2CEXL1w.png";

  const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
    creator: alice,
    collection: collectionName,
    description: tokenDescription,
    name: tokenName,
    uri: tokenURI,
  });

  const committedTxn = await aptos.signAndSubmitTransaction({
    signer: alice,
    transaction: mintTokenTransaction,
  });

  const pendingTxn = await aptos.waitForTransaction({
    transactionHash: committedTxn.hash,
  });

  const alicesCollection = await aptos.getCollectionData({
    creatorAddress: alice.accountAddress,
    collectionName,
    minimumLedgerVersion: BigInt(pendingTxn.version),
  });
  console.log(
    `Alice's collection: ${JSON.stringify(alicesCollection, null, 4)}`
  );

  const aliceDigitalAsset = await aptos.getOwnedDigitalAssets({
    ownerAddress: alice.accountAddress,
    minimumLedgerVersion: BigInt(pendingTxn.version),
  });
  console.log(`Alice's digital assets balance: ${aliceDigitalAsset.length}`);

  console.log(
    `Alice's digital asset: ${JSON.stringify(aliceDigitalAsset[0], null, 4)}`
  );
};

main();
