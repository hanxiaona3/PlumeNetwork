const ethers=require('ethers')
const OracleGame=require('./Contract/OracleGame.json');
const {PrivateKeys$18Wallets,PrivateKeys$4Wallets}=require('../../util/privateKey.cjs');
const SWAP_UTIL=require('../../util/swaptoken.cjs');
const {walletContract}=require('../../util/common.cjs')
const RPC=require('../../config/runnerRPC-1.json');


const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//获取token数量
async function QianDAO(wallet){

    // let randdata=Math.floor(Math.random()*21);
    for (let index = 0; index < 21; index++) {
        try {
            const contract=new ethers.Contract(OracleGame.address,OracleGame.abi,wallet);
            const txResponse=contract.predictPriceMovement(index,Math.random()>0.5?0:1);
            await walletContract(txResponse);
            
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }  
        
    }

}
const main=async()=>{
    for (let index = 0; index <18; index++) {//PrivateKeys$18Wallets.length 1 3-10 14 17 18 1 678910 14
        let Plume_wallet=new ethers.Wallet(PrivateKeys$18Wallets[index],Plume_Testnet_Provider);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        await QianDAO(Plume_wallet);
    }
}

main()