const { ethers } = require("hardhat");

const provider = ethers.provider;
const ADDRESSES = [
  "0x6829c091CfA40698dbB3Da56ea5E13b2c6BA38dc",
  "0x687FA78988BCfDBB8C3FECB9cE66672F7651EDe1",
  "0xE411Fed5cEdF4eB46FeB073dc4301943CEf042Af",
  "0x237BE15533Ce301A7985d2B22F0b22D218570629",
  "0xcf817a559f8AfbfEeC554539fDA7A49d3bd24614",
  "0x177F6F419a79747D0F7f97f8C24f86746339a520",
  "0x0Fd0037379c9Df8642A0bd4468A7c2DE7Eb87200",
  "0xC3d2c243fD82a363C144c483E21167F4eED37ADf",
  "0x98f8B5F6B47F77B05fA59E23f97CD35fb7b9A865",
  "0x02d696593792391254192dF0310b63bC914bfB32",
];

async function main() {
  const deployer = await ethers.getSigner();

  const factory = await ethers.getContractFactory("RSCValveFactory");
  const Factory = await factory.deploy();
  await Factory.deployed();
  console.log(Factory.address);

  let temp = await Factory.setPlatformWallet(deployer.address);
  await temp.wait();
  temp = await Factory.setPlatformFee(10000);
  await temp.wait();

  // const Factory = await ethers.getContractAt(
  //     "RSCValveFactory",
  //     "0x65540D2CD8aF7E58d3CEC09a46d3f06f1dd2D1Ec",
  //     provider.getSigner()
  // );

  temp = await Factory.createRSCValve([
    deployer.address,
    [deployer.address],
    true,
    false,
    0,
    [ADDRESSES[0], ADDRESSES[1]],
    [6000000, 4000000],
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  ]);

  let rc = await temp.wait();
  let encodedData = rc.events?.filter((x) => {
    return x.event == "RSCValveCreated";
  });
  const decoder = new ethers.utils.AbiCoder();
  let decodedData = decoder.decode(
    [
      "address",
      "address",
      "address[]",
      "uint256",
      "bool",
      "bool",
      "uint256",
      "bytes32",
    ],
    encodedData[0].data
  );
  let valveAddress = decodedData[0];
  console.log(valveAddress);

  console.log("Success!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error), process.exit(1);
  });
