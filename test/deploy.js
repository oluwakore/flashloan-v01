const {  expect, assert } = require('chai')
const {BigNumber} = require('ethers')
const { ethers, waffle, artifacts } = require('hardhat')
const hre = require('hardhat')

const {DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER} = require('../config')

describe("Deploy a Flash Loan", function () {
  it("Should take a flash loan an be able to return it", async function() {
    const flashLoanExample = await ethers.getContractFactory("FlashLoanSample")

    const _flashLoanSample = await flashLoanExample.deploy(POOL_ADDRESS_PROVIDER)

    await _flashLoanSample.deployed()

    const token = await ethers.getContractAt("IERC20", DAI)
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000")

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE]
    })
 
    const signer = await ethers.getSigner(DAI_WHALE)

    await token
      .connect(signer)
      .transfer(_flashLoanSample.address, BALANCE_AMOUNT_DAI)

      const tx = await _flashLoanSample.createFlashLoan(DAI, 1000)
      await tx.wait()
      const remainingBalance = await token.balanceOf(_flashLoanSample.address)

      expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true
  })
})