// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
require("chai").should();

describe("TwitterContract ", function () {
  //Contract variables for twitter
  let TwitterContract;
  let twitterContract;

  //User accounts
  let user1;
  let user2;


  //Initiation of test contract

  /**
   * Twitter Contract test and deployment
   * @returns {Promise}
   * @memberof TwitterContract
   */


  this.beforeEach(async () => {
    TwitterContract = await ethers.getContractFactory("TwitterContract");
    [user1,user2] = await ethers.getSigners();
    twitterContract = await TwitterContract.deploy();
  })

 /**
   * Twitter Contract - test creation of a tweet
   * @returns {Promise}
   * @memberof TwitterContract
   */

  it("Creates a new tweet message", async () => {
    await twitterContract.connect(user1)
    .createNewTweet(" I am user1. This is my first message");
    const tweets =  await twitterContract.getAllTweets();
    expect(tweets.length).to.equal(1);
  });

  /**
   * Twitter Contract - test of emission on creation of a tweet
   * @returns {Promise}
   * @memberof TwitterContract
   */
  it("Emit a new event upon creation of new message", async()=>{
    await expect(twitterContract.connect(user1).createNewTweet("This is to test the emit event"),
    ).to.emit(twitterContract,"NewMessage");
  });

  

  // Test to read all the tweet messages

  /**
   * Twitter Contract - test getting all tweet messages
   * @returns {Promise}
   * @memberof TwitterContract
   */

  it("Read all the tweet messages", async () =>{
    await twitterContract.connect(user1).createNewTweet("I am user1, hello!");
    await twitterContract.connect(user2).createNewTweet("I am user2, hello!");


    const tweets = await twitterContract.connect(user1).getAllTweets();
    expect(tweets.length).to.equal(2);
    expect(tweets[0].message).to.equal("I am user1, hello!");
    expect(tweets[1].message).to.equal("I am user2, hello!");

  });

  // Test to check update functionality

  /**
   * Twitter Contract - test updating messages
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {string} tId
   * @param {string} tweet_msg
   * 
   */

  it("Updating a perticular tweet from a single user", async() => {
    await twitterContract.connect(user1).createNewTweet("This tweet will be updated");
    await twitterContract.connect(user1).updateAMessage(0,"This is the updated tweet");
    const tweets = await twitterContract.getAllTweets();
    expect(tweets.length).to.equal(1);
    expect(tweets[0].message).to.equal("This is the updated tweet");
  })

  /**
   * Twitter Contract - test updating a particular message from all the messages
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * @param {string} tweet_msg
   * 
   */

  it("Updating a particular message from all the messages" , async() => {
    await twitterContract.connect(user1).createNewTweet("This is the message1");
    await twitterContract.connect(user1).createNewTweet("This is the message2");
    await twitterContract.connect(user1).createNewTweet("This is the message3");
    await twitterContract.connect(user1).updateAMessage(1,"This is the message2 updated");
    const tweets = await twitterContract.getAllTweets();
    expect(tweets.length).to.equal(3);
    expect(tweets[0].message).to.equal("This is the message1");
    expect(tweets[1].message).to.equal("This is the message2 updated");
    expect(tweets[2].message).to.equal("This is the message3");
  });

  /**
   * Twitter Contract - test emission of event on updation of message
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * @param {string} tweet_msg
   * 
   */
  it("Emission of event on updation ", async () => {
    await twitterContract.connect(user1).createNewTweet("I am the main user - user1 !");
    await expect(
      twitterContract.connect(user1).updateAMessage(0,"Sorry, I am only user1, not the main user"),
    ).to.emit(twitterContract,"UpdateMessage");
  });

  /**
   * Twitter Contract - test prevention of message updation of another user
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * @param {string} tweet_msg
   * 
   */

  it("Prevention of updation of other's message", async () => {
    await twitterContract.connect(user1).createNewTweet("This is my tweet, from user1");
    await twitterContract.connect(user2).createNewTweet("This is my tweet from user2");
    await twitterContract.connect(user2).updateAMessage(0,"Don't update my tweet!")
    .should.be.reverted;
  }
  );

  /**
   * Twitter Contract - test prevention of message updation on error
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * @param {string} tweet_msg
   * 
   */

  it("Prevention of updation on error", async () => {
    await twitterContract.connect(user1).createNewTweet("This will error out");
    await expect (twitterContract.connect(user1).updateAMessage(1,"This might be an error"),)
    .to.be.reverted;
  })

  // Test to check delete functionality
 /**
   * Twitter Contract - test deletion with tweet id
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * 
   */

  it("Deleting tweet with id", async () => {
    await twitterContract.connect(user1).createNewTweet("This tweet will be deleted soon");
    await twitterContract.connect(user1).deleteAMessage(0);

    const tweets = await twitterContract.getAllTweets();
    const latestTweet = tweets[0];

    expect(tweets.length).to.equal(1);
    expect(latestTweet.message).to.equal("");
  });

  /**
   * Twitter Contract - test deletion of a message among others using tweet id
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * 
   */
  it("Delete a tweet message among others with a particular id", async () => {
    await twitterContract.connect(user1).createNewTweet("This tweet might be deleted");
    await twitterContract.connect(user2).createNewTweet("This is tweet from user2");
    await expect(twitterContract.connect(user1).deleteAMessage(1)).to.be.reverted;
    const tweets = await twitterContract.getAllTweets();
    expect(tweets.length).to.equal(2);
  });

  /**
   * Twitter Contract - test prevention of deletion of tweets of other user
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * 
   */

  it("Prevention of deletion of tweet message from another user", async () => {
    await twitterContract.connect(user1).createNewTweet("This is my tweet 1");
    await expect(twitterContract.connect(user2).deleteAMessage(0)).to.be.reverted;

  });
  
  /**
   * Twitter Contract - test emission of event on deletion
   * @returns {Promise}
   * @memberof TwitterContract
   * @param {number} tId
   * 
   */

  it("Emission of event on deletion", async () => {
await twitterContract.connect(user1).createNewTweet("This is a tweet which on deletion will emit an event");
await expect(twitterContract.connect(user1).deleteAMessage(0)).to.emit(
  twitterContract,
  "DeleteMessage"
);
  });
});










