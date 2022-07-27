import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task(
  "whitelist",
  "Whitelists in the PixelCards contract",
  async (args, hre) => {
    const whitelistAddresses = JSON.parse(
      process.env.WHITELIST_ADDRESSES || "[]"
    );
    const contractAddress: string = process.env.CONTRACT_ADDRESS || "";

    if (!contractAddress || whitelistAddresses.length == 0) {
      process.stdout.write(
        "You need to set the contract address and whitelist"
      );
      process.exit();
    }

    const myContract = await hre.ethers.getContractAt(
      "PixelCards",
      contractAddress
    );

    const transaction = await myContract.addToWhitelist(whitelistAddresses);

    process.stdout.write(`Transaction written with hash: ${transaction.hash}`);

    let isOnWhitelist =
      (await myContract.isOnWhitelist(whitelistAddresses[0])) &&
      (await myContract.isOnWhitelist(
        whitelistAddresses[whitelistAddresses.length - 1]
      ));

    if (isOnWhitelist) {
      process.stdout.write("Whitelist updated, read checks correct");
    } else {
      process.stdout.write(
        "There was some kind of problem, check aren't passing"
      );
    }
  }
);
