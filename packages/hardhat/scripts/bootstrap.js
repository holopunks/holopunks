const hre = require("hardhat");
const externalABIs = require('../../react-app/src/contracts/external_contracts.js');
const BAYCABI = externalABIs['1'].contracts.BAYC.abi;
const baycToken = externalABIs['1'].contracts.BAYC.address;

const ethBal = async (signer) => hre.ethers.utils.formatEther(await signer.getBalance());

const ape3368owner = '0x931d1156b4c2f95b21d61f129d1e1b640bb30932';
const ape3650owner = '0x4ab16a42c6d06aed8bf46911267c40afc37e2270';
const ape6480owner = '0x81974c1a09e53c5129c6e4f74e547fda0adf4d2d';

const tomoTester = "0x7212f07cc038cC838B0B7F7AE236bf98dae221d4";
const recipient = tomoTester;

async function main() {
  // await hre.network.provider.send("evm_mine");

  const recipientSigner = await hre.ethers.getSigner(recipient);
  const signer3368 = await hre.ethers.getSigner(ape3368owner);
  const signer3650 = await hre.ethers.getSigner(ape3650owner);
  const signer6480 = await hre.ethers.getSigner(ape6480owner);
  const accounts = [recipient, ape3368owner, ape3650owner, ape6480owner];
  for (let i = 0; i < accounts.length; i++) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [accounts[i]],
    });
  }
  // ape3650owner account also has some ETH to steal
  await signer3650.sendTransaction({to: recipient, value: hre.ethers.utils.parseEther("0.1")});
  console.log("new ETH balance is", await ethBal(recipientSigner));
  
  const apeContract3368 = new hre.ethers.Contract(baycToken, BAYCABI , signer3368);
  await apeContract3368['transferFrom'](ape3368owner, recipient, 3368);
  
  const apeContract3650 = new hre.ethers.Contract(baycToken, BAYCABI , signer3650);
  await apeContract3650['transferFrom'](ape3650owner, recipient, 3650);
  
  const apeContract6480 = new hre.ethers.Contract(baycToken, BAYCABI , signer6480);
  await apeContract6480['transferFrom'](ape6480owner, recipient, 6480);
  console.log("new ape balance is ", await apeContract3368.balanceOf(recipient));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

