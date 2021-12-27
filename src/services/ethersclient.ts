import { ethers } from "ethers";

class EthersClient {
    provider: ethers.providers.JsonRpcProvider;
    contract: ethers.Contract;

    constructor(rpcServer: string) {
      this.provider = new ethers.providers.JsonRpcProvider(rpcServer);
      this.contract = this.initContract()
    }

    initContract() {
        const address = '0xD22a947b83AE7ce6Bf9092431c94C39c68C88002'
        const artifact = require('../../build/contracts/CardFactory.json')

        return new ethers.Contract(address, artifact.abi, this.provider)
    }

    async getCurrentAccount() {
        return await this.provider.listAccounts();
    }
}

export default EthersClient
