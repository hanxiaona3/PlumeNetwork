const ethers=require('ethers')
const axios=require('axios')
const bulbaswapWETHABI = require('../config/bulbaswapWETHABI.json');
const bulbaswapNativeRouterABI = require('../config/bulbaswapNativeRouterABI.json');
const {PrivateKeys$18Wallets,yangaina,lovebean}=require('../util/privateKey.cjs');
const SWAP_UTIL=require('../util/swaptoken.cjs');
const {NewPrivatKeys,sleep,getRandomUniqueIndices,convertNumToHexa,walletSendtxData}=require('../util/common.cjs')
const fakeUa = require('fake-useragent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const RPC=require('../config/runnerRPC-1.json');

const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC

async function QianDAO(wallet){
    // console.log(`每天领取测试代币。。。。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x032139f44650481f4d6000c078820B8E734bF253';
    let retries=0;
    // let random_num=[0,1,2,3,4,5,6,7,8,9,a,b,c];
    const random_cypto=['Ethereum','Bitcoin','Arbitrum','EUR/USD','USD/JPY','GBP/USD','Solana','USD/VND','Celestia','USD/HKD','MakerDAO','USD/SGD','Ondo','USD/INR'];
    const temp_rand=(wallet.address==yangaina[0]||wallet.address==lovebean[0])?random_cypto.length:8;
    const vote_number=Math.floor(Math.random()*(random_cypto.length-temp_rand)+temp_rand);
    console.log(`${new Date().getMonth()+1}月${new Date().getDate()}日`);
    console.log(`投票项目数量是：${vote_number}`);

    const randomIndices=getRandomUniqueIndices(random_cypto);
    for (let index = 0; index < vote_number; index++) {
        if (retries>=5) {break;}//跳出循环，说明这个钱包已经做过对应的处理
        console.log(`第${index+1}项目：${random_cypto[randomIndices[index]]}`);
        let datas=`0xe940f6a9${'0'.repeat(63)}${convertNumToHexa(randomIndices[index])}${'0'.repeat(63)}${Math.random()>0.5?0:1}`;
        const txData = {
            to: Interacted_contract_Token, 
            data:datas,
            value: 0,
            // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
        };
        retries += await walletSendtxData(wallet,txData);
        await sleep(10);
    }
}

const main=async(privateKeys)=>{

    // const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);
    for (let index = 0; index < privateKeys.length; index++) {//PrivateKeys$18Wallets.length
        let Plume_wallet=new ethers.Wallet(privateKeys[index],Plume_Testnet_Provider);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        await QianDAO(Plume_wallet);    
    }
}
main(PrivateKeys$18Wallets)