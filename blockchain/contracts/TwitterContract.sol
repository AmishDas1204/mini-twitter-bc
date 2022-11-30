// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TwitterContract {

//Events in the process
event UpdateMessage(uint256 t_id, uint256 tstmp, string msg);
event NewMessage(uint256 t_id, uint256 tstmp, string msg);
event DeleteMessage(uint256 tid);

    //Definition of the tweet structure
    struct Tweets{
        uint256 tweet_num;
        string message;
        uint256 timestamp;
    }
// Array of the tweets of an individual
Tweets[] public tweets;


// mapping of the tweet messages to the owner
mapping(uint256 => address) public tweetMsgToUser;
//Delete a tweet message

function deleteAMessage(uint256 _tId) external {
    require(
        msg.sender == tweetMsgToUser[uint32(_tId)],
        "You are not the owner. Hence, you can't delete it, sorry!"
    );
    tweets[_tId] = Tweets(uint256(0),"",uint256(0));
    tweetMsgToUser[uint256(_tId)] = address(0);

    emit DeleteMessage(uint256(_tId));
}

//function to create a new tweet
function createNewTweet(string memory _msg) public {
    uint256 _size = uint256(tweets.length);

    tweets.push(Tweets(_size , _msg, uint256(block.timestamp)));
    tweetMsgToUser[_size] = msg.sender;

    emit NewMessage(_size, uint256(block.timestamp), _msg);
}

// Function to get all the tweets
function getAllTweets() public view returns (Tweets[] memory){
    return tweets;
}

// Function to Update a message/tweet

function updateAMessage(uint256 _tId, string memory _msg) external {
    require(
        msg.sender == tweetMsgToUser[uint256(_tId)],
        "You are not the owner. Hence, you can't update it, sorry!"
    );
    tweets[_tId].message = _msg;
    tweets[_tId].timestamp = uint32(block.timestamp);
    
    emit UpdateMessage(uint256(_tId),uint256(block.timestamp),_msg);
}


}
