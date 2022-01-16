const hre = require("hardhat");
const externalABIs = require('../../react-app/src/contracts/external_contracts.js');
const WOWABI = externalABIs['1'].contracts.WOW.abi;
const wowToken = externalABIs['1'].contracts.WOW.address;

const ercBal = async (c, addr, dec) => hre.ethers.utils.formatUnits(await c.balanceOf(addr), dec);
const ethBal = async (signer, addr) => hre.ethers.utils.formatEther(await signer.getBalance(addr));

const wow0Owner = '0x5115c67F5621440FD8413cdAD36FDf89b8AC4C01';
const tomoTester = "0x7212f07cc038cC838B0B7F7AE236bf98dae221d4";
const recipient = tomoTester;

async function main() {
  // await hre.network.provider.send("evm_mine");

  const recipientSigner = await hre.ethers.getSigner(recipient);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [recipient],
  });
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [wow0Owner],
  });
  const wowSigner = await hre.ethers.getSigner(wow0Owner);
  // wow account also has some ETH to steal
  await wowSigner.sendTransaction({to: recipient, value: hre.ethers.utils.parseEther("0.1")});
 
// Received invalid block tag 462913859648861565929915325653361798795844406273. Latest block number is 14014001
  // console.log("new ETH balance is", await ethBal(recipientSigner, recipient));

  const wowContract = new hre.ethers.Contract(wowToken, WOWABI , wowSigner);
  //console.log(wowContract);
  await wowContract['safeTransferFrom(address,address,uint256)'](wow0Owner, recipient, 0);
  console.log("new WOW balance is ", await wowContract.balanceOf(recipient));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

