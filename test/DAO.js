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
    investor1 = accounts[2]
    recipient = accounts[3]

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

  describe('Proposal Creation', () => {
    let transaction, result
      describe('Success', () => {
        
        beforeEach(async () => {
          transaction = await DAO.connect(investor1).createProposal('Proposal 1', ether(100), recipient.address)
          result = await transaction.wait()
        })

        it('updates proposal count', async () => {
          expect(await DAO.proposalCount()).to.equal(1)
        })
        it('updates proposal mapping', async () => {
          const proposal = await DAO.proposals(1)
          expect(proposal.id).to.equal(1)
          expect(proposal.amount).to.equal(ether(100))
          expect(proposal.recipient).to.equal(recipient.address)

        })
        it('emits a propose event', async () => {
          await expect(transaction).to.emit(DAO, 'Propose')
          .withArgs(1, ether(100), recipient.address, investor1.address)

        })



      })

      describe('Failure', () => {
        it('rejects invalid amount', async () => {
          await expect(DAO.connect(investor1).createProposal('Proposal 1', ether(1000), recipient.address)).to.be.reverted
        })
      })
  })


 

})
