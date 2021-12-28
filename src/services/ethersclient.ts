import { ethers } from "ethers";

class EthersClient {
    provider: ethers.providers.Web3Provider;
    contract: ethers.Contract;

    constructor(rpcServer: any) {
      this.provider = new ethers.providers.Web3Provider(rpcServer);
      this.contract = this.initContract()
    }

    initContract() {
        const address = '0xD22a947b83AE7ce6Bf9092431c94C39c68C88002'
        const artifact = require('../../build/contracts/CardFactory.json')

        return new ethers.Contract(address, artifact.abi, this.provider)
    }
}

export default EthersClient
