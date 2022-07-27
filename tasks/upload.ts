import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import axios from "axios";

task(
  "upload-metadata",
  "Upload Metadata to the IPFS network",
  async (args, hre) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const JSONBody = { hello: "world" };

    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY || "",
          pinata_secret_api_key: process.env.PINATA_API_SECRET || "",
        },
      })
      .then(function (response) {
        // TODO handle response here
      })
      .catch(function (error) {
        // TODO handle error here
      });
  }
);
