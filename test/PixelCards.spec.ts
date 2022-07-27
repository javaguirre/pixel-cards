import chai from "chai";
import { ethers } from "hardhat";
import { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("PixelCards contract", function () {
  let contract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const hash = "123456";
  const prereveal = "https://gateway.pinata.cloud/ipfs/123456";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("PixelCards");
    contract = await Contract.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("I can't mint if not in whitelist", async function () {
    await expect(contract.mintToken(addr1.address, hash)).to.be.revertedWith(
      "You are not in the whitelist with this Wallet"
    );
  });

  it("I can't mint if the correct price hasn't been payed", async function () {
    await contract.addToWhitelist([addr1.address]);

    await expect(contract.mintToken(addr1.address, hash)).to.be.revertedWith(
      "Not enough ETH sent; check the price!"
    );
  });

  it("I can't mint if I have already the total of tokens per wallet", async function () {
    await contract.addToWhitelist([addr1.address]);
    const total: number = await contract.totalTokensPerWallet();
    const price = await contract.whitelistPrice();

    for (let count = 1; count <= total; count++) {
      contract
        .connect(addr1)
        .mintToken(
          addr1.address,
          hash,
          { value: price });
    }

    await expect(
      contract
        .connect(addr1)
        .mintToken(
          addr1.address,
          hash,
          { value: price })
    ).to.be.revertedWith(
      "You have reach the token limit, can't buy more for now"
    );
  });

  it("I can mint if I'm in whitelist, payed the right amount and I haven't reached the token limit", async function () {
    await contract.addToWhitelist([addr1.address]);
    const price = await contract.whitelistPrice();

    await contract
      .connect(addr1)
      .mintToken(addr1.address, hash, { value: price });
    const balance = await contract.balanceOf(addr1.address);

    await expect(balance).to.equal(1);
  });

  it("As a user I can see the prereveal token", async function () {
    const tokenId = 1;
    await contract.addToWhitelist([addr1.address]);
    const price = await contract.whitelistPrice();

    await contract
      .connect(addr1)
      .mintToken(addr1.address, hash, { value: price });
    const uri = await contract.tokenURI(tokenId);

    await expect(uri).to.equal(prereveal);
  });

  it("As a user I can see the url of my token", async function () {
    const tokenId = 1;
    const price = await contract.whitelistPrice();
    await contract.addToWhitelist([addr1.address]);
    await contract.setIsRevealed(true);
    await contract.setBaseURI("https://ipfs.pinata.cloud/");

    await contract
      .connect(addr1)
      .mintToken(addr1.address, hash, { value: price });
    const uri = await contract.tokenURI(tokenId);

    await expect(uri).to.equal(`https://ipfs.pinata.cloud/${hash}`);
  });

  it("As a user I want to see the token price when in public", async function () {
    const expectedPrice = await contract.publicPrice();

    await contract.setIsPublicSale(true);
    const tokenPrice = await contract.connect(addr1).getTokenPrice();

    await expect(tokenPrice).to.equal(expectedPrice);
  });

  it("As a user I want to see the token price when in whitelist", async function () {
    const expectedPrice = await contract.whitelistPrice();

    await contract.setIsPublicSale(false);
    const tokenPrice = await contract.connect(addr1).getTokenPrice();

    await expect(tokenPrice).to.equal(expectedPrice);
  });

  it("As a user I can't set the sale from sale to public or viceversa", async function () {
    await expect(
      contract.connect(addr1).setIsPublicSale(true)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("As a user I can't set the baseURI", async function () {
    await expect(
      contract.connect(addr1).setBaseURI("https://cryptozombies.com/")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("As an owner I can set the baseURI even when the token is already minted", async function () {
    const tokenId = 1;
    await contract.addToWhitelist([addr1.address]);
    await contract.setIsRevealed(true);
    await contract
      .connect(addr1)
      .mintToken(addr1.address, hash, { value: ethers.utils.parseEther("0.9") });

    await contract.setBaseURI("https://cryptozombies.com/");
    const uri = await contract.tokenURI(tokenId);

    await expect(uri).to.equal("https://cryptozombies.com/123456");
  });
});
