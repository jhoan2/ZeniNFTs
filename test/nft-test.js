const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    //Gets our contract
    const ZeniNFT = await ethers.getContractFactory("ZeniNFT");
    //Deploys our contract
    const zeninft = await ZeniNFT.deploy();
    await zeninft.deployed();

    const recipient = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199';
    const metadataURI = 'cid/test.png'

    let balance = await zeninft.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await zeninft.payToMint(recipient, metadataURI, {
      value : ethers.utils.parseEther('0.05')
    })
    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await zeninft.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await zeninft.isContentOwned(metadataURI)).to.equal(true);
  });
});
