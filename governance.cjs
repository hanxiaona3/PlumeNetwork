const ethers=require('ethers')
const Governance=require('./Contract/Governance.json');
const {PrivateKeys$18Wallets,PrivateKeys$136Wallets}=require('../../util/privateKey.cjs');
const {walletContract, sleep,RPC_provider}=require('../../util/common.cjs')
const RPC=require('../../config/runnerRPC-1.json');
// const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
// const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//获取token数量
async function vote(wallet){
    let randdata=Math.floor(Math.random()*(17-4)+4);
    try {
        const contract=new ethers.Contract(Governance.address,Governance.abi,wallet);
        const txResponse=contract.vote(randdata);
        await walletContract(txResponse);
        
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }  
}
const main=async(privateKeys)=>{
    for (let index = 0; index <privateKeys.length; index++) {//PrivateKeys$18Wallets.length 1 3-10 14 17 18 1 678910 14
        let Plume_wallet=new ethers.Wallet(privateKeys[index],await RPC_provider(RPC.plumerpc));
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        for (let i=0;i < 3;i++) {
            await sleep(1);
            await vote(Plume_wallet);
        }
    }
}
main(PrivateKeys$18Wallets)