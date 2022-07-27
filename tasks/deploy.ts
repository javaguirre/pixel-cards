import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task(
  "deploy",
  "Deploys the PixelCards contract",
  async (args, hre) => {
    return hre.ethers
      .getContractFactory("PixelCards")
      .then((contractFactory) => contractFactory.deploy())
      .then((result) => {
        process.stdout.write(`Contract address: ${result.address}\n`);
      });
  }
);
