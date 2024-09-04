//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import './Token.sol';

contract DAO {
    address owner;
    Token public token;
    uint256 public quorum;

    mapping(uint256 => Proposal) public proposals;


    event Propose(
        uint256 id,
        uint256 amount,
        address recipient,
        address creator
    );
    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool finalized;
    }

    uint256 public proposalCount;

    constructor(Token _token ,uint256 _quorum) {
        owner = msg.sender;
        token = _token;
        quorum = _quorum;
    }
    receive() external payable {}

    function createProposal(
        string memory _name, 
        uint256 _amount, 
        address payable _recipient
    ) external {
        require(address(this).balance >= _amount);

        require(
            Token(token).balanceOfr(msg.sender) > 0, 
            'must be token holder'
        );
        proposalCount++;
        proposals[proposalCount] = Proposal(
            proposalCount, 
            _name, 
            _amount, 
            _recipient, 
            0, 
            false
        );

        emit Propose(
            proposalCount,
            _amount, 
            _recipient, 
            msg.sender
        );
    }
}
