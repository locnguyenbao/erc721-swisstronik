const hre = require("hardhat");
const { ethers } = hre;

async function getBalance(address) {
  const provider = ethers.provider;
  const balance = await provider.getBalance(address);
  return balance;
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  const NFT = await ethers.getContractFactory("NBL_NFT");
  const name = "NBL_NFT";
  const symbol = "NNFT";

  console.log("Deploying contract with the following parameters:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Deploying contract...");

  const contract = await NFT.deploy(name, symbol);

  await contract.waitForDeployment();

  console.log("Contract deployed to address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
