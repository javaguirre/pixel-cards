import chai from "chai";
import { ethers } from "hardhat";
import { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("Whitelist contract", function () {
  let contract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Whitelist");
    contract = await Contract.deploy();
  });

  it("Check if the list is active on deploy", async function () {
    const isListActive = await contract.isWhitelistActive();

    expect(isListActive).to.equal(true);
  });

  it("As the owner I can disable the whitelist", async function () {
    await contract.setWhitelistActive(false);

    const isListActive = await contract.isWhitelistActive();

    expect(isListActive).to.equal(false);
  });

  it("If I'm not the owner I can't disable the whitelist", async function () {
    await expect(
      contract.connect(addr1).setWhitelistActive(false)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Check whitelist inactive after setting it", async function () {
    await contract.setWhitelistActive(false);

    const isActive = await contract.isWhitelistActive();

    expect(isActive).to.equal(false);
  });

  it("Add two elements to the whitelist and check", async function () {
    await contract.addToWhitelist([addr1.address, addr2.address]);
    const isAccountOneInWhitelist = await contract.isOnWhitelist(addr1.address);
    const isAccountTwoInWhitelist = await contract.isOnWhitelist(addr2.address);
    const isFakeAccountOnWhitelist = await contract.isOnWhitelist(
      "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    );

    expect(isAccountOneInWhitelist).to.equal(true);
    expect(isAccountTwoInWhitelist).to.equal(true);
    expect(isFakeAccountOnWhitelist).to.equal(false);
  });

  it("if the whitelist is not active I should have access", async function () {
    await contract.setWhitelistActive(false);

    const isListActive = await contract
      .connect(addr1)
      .isOnWhitelist(addr1.address);

    expect(isListActive).to.equal(true);
  });
});
