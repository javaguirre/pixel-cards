import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task(
  "tokenuri",
  "Checks the tokenURI of certain token",
  async (args, hre) => {
    const tokenId: string = process.env.TOKEN_ID || "1";
    const contractAddress: string = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

    console.log(
        "Hi! Wait while we get the data"
    );

    if (!contractAddress || !tokenId) {
      console.log(
        "You need to set the contract address and tokenID"
      );
      process.exit();
    }

    const myContract = await hre.ethers.getContractAt(
      "PixelCards",
      contractAddress
    );

    const tokenURI = await myContract.tokenURI(tokenId);

    console.log(`The Token URI is : ${tokenURI}`);
  }
);
