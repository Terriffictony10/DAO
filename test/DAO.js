const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('DAO', () => {
  let token, accounts, DAO

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Dapp University', 'DAPP', '1000000')

    const Dao = await ethers.getContractFactory("DAO")
    DAO = await Dao.deploy(token.address, '500000000000000000000001')

    accounts = await ethers.getSigners()
    deployer = accounts[0]
    funder = accounts[1]

    await funder.sendTransaction({ to: DAO.address, value: ether(100) })
    
  })

  describe('Deployment', () => {
    it('sends Ether to the DAO treasury', async () => {
      expect(await ethers.provider.getBalance(DAO.address)).to.equal(ether(100))
    })

    it('returns token address', async () => {
      expect(await DAO.token()).to.equal(token.address)
    })
    it('returns quorum', async () => {
      expect(await DAO.quorum()).to.equal('500000000000000000000001')
    })

    

  })


 

})
