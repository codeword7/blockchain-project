async function main() {
  console.log(`Preparing deployment...\n`);

  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  const accounts = await ethers.getSigners();
  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`);

  const nrj = await Token.deploy('Neeraj', 'NRJ', "1000000");
  await nrj.deployed();
  console.log(`NRJ deployed to: ${nrj.address}`)

  const mETH = await Token.deploy('mETH', 'mETH', "1000000");
  await mETH.deployed();
  console.log(`mETH deployed to: ${mETH.address}`)

  const mDAI = await Token.deploy('mDAI', 'mDAI', "1000000");
  await mDAI.deployed();
  console.log(`mDAI deployed to: ${mDAI.address}`)

  const exchange = await Exchange.deploy(accounts[1].address, 10);
  await exchange.deployed();
  console.log(`Exchange deployed to: ${exchange.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
