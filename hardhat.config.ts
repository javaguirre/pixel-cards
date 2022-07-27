/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import { HardhatUserConfig } from "hardhat/types";
import("@nomiclabs/hardhat-ethers");

require("solidity-coverage");
require("dotenv").config();
const {
  API_URL, ETH_PRIVATE_KEY,
  ETH_PRIVATE_KEY_ACCOUNT1, ETH_PRIVATE_KEY_ACCOUNT2
} = process.env;

import("./tasks/deploy");
import("./tasks/whitelist");
import("./tasks/upload");
import("./tasks/tokenuri");

const config: HardhatUserConfig = {
  solidity: "0.8.1",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        `${ETH_PRIVATE_KEY}`,
        `${ETH_PRIVATE_KEY_ACCOUNT1}`,
        `${ETH_PRIVATE_KEY_ACCOUNT2}`,
      ],
    },
    goerli: {
      url: API_URL,
      accounts: [`0x${ETH_PRIVATE_KEY}`],
    },
  },
};

export default config;
