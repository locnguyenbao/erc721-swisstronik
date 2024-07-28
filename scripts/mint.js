const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */
const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpclink = hre.network.config.url;

  console.log("RPC link:", rpclink);
  console.log("Data before encryption:", data);

  const [encryptedData] = await encryptDataField(rpclink, data);

  console.log("Encrypted data:", encryptedData);

  const tx = await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });

  console.log("Signed transaction:", tx);

  return tx;
};

async function main() {
  const recipient = "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1";
  
  // Replace this with your actual deployed contract address
  const contractAddress = "0xF23164d351495cb68050ea673fb1bBa7464363db"; 

  const [signer] = await hre.ethers.getSigners();
  console.log("Using account:", signer.address);

  const nftAbi = [
    "function mint(address recipient) external returns (uint256)"
  ];
  const nftContract = new ethers.Contract(contractAddress, nftAbi, signer);

  console.log(`Minting NFT for ${recipient}...`);

  try {
    const data = nftContract.interface.encodeFunctionData("mint", [recipient]);

    const tx = await sendShieldedTransaction(signer, contractAddress, data, 0);

    console.log("Transaction hash before wait:", tx.hash);

    const receipt = await tx.wait();

    console.log("Transaction hash after wait:", receipt.transactionHash);
    console.log("Minting complete. Token minted for:", recipient);
  } catch (error) {
    console.error("Minting failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
