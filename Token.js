const {expect}=require("chai");//chai is a assertion library used for testing
const {loadFixture}=require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Token contract",function(){

    async function deployTokenFixture(){
        const Token=await ethers.getContractFactory("Token");
        const [owner,addr1,addr2]=await ethers.getSigners();
        const HardhatToken=await Token.deploy();//triggers deployment
        return{Token,HardhatToken,owner,addr1,addr2};
    }

    it("Is owner is correct",async function (){
        const {HardhatToken,owner}=await loadFixture(deployTokenFixture);
        expect(await HardhatToken.owner()).to.equal(owner.address);
    }) 

    //test-2
    it("Owners totalSupply", async function(){

     const {HardhatToken,owner}=await loadFixture(deployTokenFixture);

        const ownerBalance=await HardhatToken.balanceOf(owner.address);
        expect(await HardhatToken.totalSupply()).to.equal(ownerBalance);
    })//to perform separate test


    //test-3
    it("Transfered", async function(){
        const {HardhatToken,owner,addr1,addr2}=await loadFixture(deployTokenFixture);

        // await HardhatToken.Transfers(addr1.address,100);
        // expect(await HardhatToken.AccountBalance(addr1.address)).to.equal(100);
                            //(or)
        await  expect(HardhatToken.transfer(addr1.address,100)).to.changeTokenBalances(HardhatToken,[owner,addr1],[-100,100])

        // await HardhatToken.connect(addr1).Transfers(addr2.address,100);
        // expect(await HardhatToken.AccountBalance(addr2.address)).to.equal(100);
                            //(or)
        await expect(HardhatToken.connect(addr1).transfer(addr2.address,100)).to.changeTokenBalances(HardhatToken,[addr1,addr2],[-100,100])
    })

    //test-4

    it("event emit",async function() {
    const {HardhatToken,owner,addr1,addr2} =await loadFixture(deployTokenFixture);
    await expect(HardhatToken.transfer(addr1.address,100)).to.emit(HardhatToken,"Transfer").withArgs(owner.address,addr1.address,100);
    await expect(HardhatToken.connect(addr1).transfer(addr2.address,100)).to.emit(HardhatToken,"Transfer").withArgs(addr1.address,addr2.address,100);
    })

    //test-5

    // it("Extra testes",async function() {
    //     const {HardhatToken,owner,addr1,addr2}=await loadFixture(deployTokenFixture);
    //     const intialAmount=await HardhatToken.balanceOf(owner.address);
    //     await expect(HardhatToken.connect(addr1).transfer(owner.address,1)).to.be.revertedWith("Insufficient Amount");
    //    await expect(HardhatToken.balanceOf(owner.address)).to.equal(intialAmount);
    // })

})//to group two or more testes