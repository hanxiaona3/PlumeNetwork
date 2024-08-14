const ethers=require('ethers')
const axios=require('axios')
const bulbaswapWETHABI = require('../../config/bulbaswapWETHABI.json');
const bulbaswapNativeRouterABI = require('../../config/bulbaswapNativeRouterABI.json');
const {PrivateKeys$18Wallets,PrivateKeys$4Wallets}=require('../../util/privateKey.cjs');
const SWAP_UTIL=require('../../util/swaptoken.cjs');
const {NewPrivatKeys,sleep,formHexData,transactionData,convertNumToHexa,walletSendtxData}=require('../../util/common.cjs')
const fakeUa = require('fake-useragent');
const { HttpsProxyAgent } = require('https-proxy-agent');
// const chalk = require("chalk");
// import chalk from 'chalk';

const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//合约地址集合
const GOON_address='0xbA22114ec75f0D55C34A5E5A3cf384484Ad9e733';//合约地址
const CrocSwapDex_address='0x4c722A53Cf9EB5373c655E1dD2dA95AcC10152D1';//合约地址

let headers= {
    'authority': 'plume-testnet.explorer.caldera.xyz',
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'origin': 'https://testnet-explorer.plumenetwork.xyz',
    'referer': 'https://testnet-explorer.plumenetwork.xyz/',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36'
  }
//GOON转化为goonUSD函数
async function NFT_minted(wallet) {
    console.log(`mint NFT过程。。。。。。。。。。。。。。。。`);
    const KUMAMint='0x8504a242d86C7D84Fd11E564e6291f0A20d6C2a2';//合约地址
    // console.log(`NFT获取进行。。。。。。。。。。。。。。。。。。`);
    let address=wallet.address;
    //approve程序
    let retries = 0;
    let maxRetries=3;
    while (retries < maxRetries) {
        let txData = {
            from:address,
            to: KUMAMint,
            data: '0x6966ee57',
            value: 0,
        };
        try {
            const txPromise = await wallet.sendTransaction(txData);
            const transactionResponse= await Promise.race([
                await txPromise.wait(),
                new Promise((_,reject)=>setTimeout(()=>reject(new Error('TimeOut')),timeout))                
            ]);
            // const receipt = await transactionResponse.wait();
            const receipt=transactionResponse.hash
            console.log("交易hash是:",receipt); 
            retries=maxRetries;
            await sleep(2)   
            return receipt;       
        } catch (error) {
            // console.error(`Error occurred: ${error.message}`);//暂时屏蔽掉错误信息
            retries++;
            if(retries >= maxRetries){
                return 0;
            }
            console.error(`开始尝试第${retries}次`);
            await sleep(3);//等待3s时间
        }         
    }
   
}
async function NFT_kuma_minted(wallet,hash){

//获取NFT的标记
    await sleep(10);

    let retries=0;
    let maxRetries=4;
    let token='';
    while (retries <maxRetries) {
        const url=`https://plume-testnet.explorer.caldera.xyz/api/v2/transactions/${hash}`
        console.log(url);
        try {
            const response= await axios.get(url)//,{headers:headers})
            const transactionResponse= await Promise.race([
                response,
                new Promise((_,reject)=>setTimeout(()=>reject(new Error('TimeOut')),timeout))                
            ]);
            token=response.data.token_transfers[0].total.token_id;
            console.log(`获取数据是：${token}`);   
            retries=maxRetries;
        } catch (error) {
            retries++;
            if(retries >= maxRetries){
                return 1;
            }
            console.error(`开始尝试第${retries}次`);
        }    
    }

    await sleep(5);
    //approve过程
    console.log(`approve过程。。。。。。。。。。。。。。。。`);
    const KUMABondToken='0x763Ccc2Cb06Eb8932208C5714ff5c010894Ac98d';//合约地址
    const ERC1967Proxy='0xA4E9ddAD862A1B8b5F8e3d75a3AAd4C158E0faaB';
    let approve_transactionData=`0x095ea7b3${formHexData(ERC1967Proxy.substring(2))}${formHexData(convertNumToHexa(BigInt(token)))}`;
    let txData = {
        to: KUMABondToken,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);

    console.log(`swap过程。。。。。。。。。。。。。。。。`);
    approve_transactionData=`0xaf81e175${formHexData(convertNumToHexa(BigInt(token)))}`;
    txData = {
        to: ERC1967Proxy,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);
}

const main=async()=>{  //PrivateKeys$18Wallets.length   3 4 5 7  10-16
    for (let index = 0; index <18 ; index++) {//PrivateKeys$18Wallets.length
        let Plume_wallet=new ethers.Wallet(PrivateKeys$18Wallets[index],Plume_Testnet_Provider);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        const nft=await NFT_minted(Plume_wallet);
        await NFT_kuma_minted(Plume_wallet,nft)
        // await mmmm()
        await sleep(3);
        
    }

}

main()