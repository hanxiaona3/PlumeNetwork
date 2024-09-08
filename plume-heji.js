import { ethers } from 'ethers';
import axios from 'axios';
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
// import {getTokenBalance} from '../../util/swaptoken.js';
import { NewPrivatKeys,getTokenBalance,RPC_provider, formHexData, walletSendtxData, sleep, walletContract, range, getRandomUniqueIndices } from '../../util/common.js';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import Governance from './Contract/Governance.json' assert { type: 'json' };
import RWAFactory from './Contract/RWAFactory.json' assert { type: 'json' };
import OracleGame from './Contract/OracleGame.json' assert { type: 'json' };
import KUMABondToken from './Contract/KUMABondToken.json' assert { type: 'json' };
import KUMASwap from './Contract/KUMASwap.json' assert { type: 'json' };
import mintAICK from './Contract/mintAICK.json' assert { type: 'json' };
import bulbaswapWETHABI from '../../config/bulbaswapWETHABI.json' assert { type: 'json' };
import NestStaking from './Contract/NestStaking.json' assert { type: 'json' };
import solidviolet from './Contract/solidviolet.json' assert { type: 'json' };

import pLimit from 'p-limit';
const CONCURRENCY_LIMIT=15;

//签到函数
async function QianDAO(wallet){
    console.log(`签到过程。。。。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x8Dc5b3f1CcC75604710d9F464e3C5D2dfCAb60d8';
    const txData = {
        to: Interacted_contract_Token, 
        data: `0x183ff085`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
}
//投票函数
async function vote(wallet){
    console.log(`投票过程。。。。。。。。。。。。。。。。。。。。。`);
    for (let index = 0; index < 3; index++) {
        try {
            let randdata=Math.floor(Math.random()*(17-4)+4);
            const contract=new ethers.Contract(Governance.address,Governance.abi,wallet);
            const txResponse=contract.vote(randdata);
            await walletContract(txResponse);
            await sleep(1);
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }   
    }
}
//arc-RWA函数
const RWACategory=[
    {name:"art",count:0,hex:'https://miles.plumenetwork.xyz/images/arc/art.webp'},
    {name: "collectible-cards",count:1,hex:'https://miles.plumenetwork.xyz/images/arc/collectible-cards.webp'},
    {name:"farming",count:2,hex:'https://miles.plumenetwork.xyz/images/arc/farming.webp'},
    {name:"investment-alcohol",count:3,hex:'https://miles.plumenetwork.xyz/images/arc/investment-alcohol.webp'},
    {name:"investment-cigars",count:4,hex:'https://miles.plumenetwork.xyz/images/arc/investment-cigars.webp'},
    {name:"investment-watch",count:5,hex:'https://miles.plumenetwork.xyz/images/arc/investment-watch.webp'},
    {name:"rare-sneakers",count:6,hex:'https://miles.plumenetwork.xyz/images/arc/rare-sneakers.webp'},
    {name:"real-estate",count:7,hex:'https://miles.plumenetwork.xyz/images/arc/real-estate.webp'},
    {name:"solar-energy",count:8,hex:'https://miles.plumenetwork.xyz/images/arc/solar-energy.webp'},
    {name:"tokenized-gpus",count:9,hex:'https://miles.plumenetwork.xyz/images/arc/tokenized-gpus.webp'},
];
async function Arc(wallet){
    console.log(`RWA过程。。。。。。。。。。。。。。。。。。。。。`);
    let wallet_temp=ethers.Wallet.createRandom();
    let array_phrase=wallet_temp.mnemonic.phrase.toLocaleUpperCase().split(' ');
    let wallet_name=''
    for (let index = 0; index < array_phrase.length; index++) {
        if (array_phrase[index].length > 4) {
            wallet_name=array_phrase[index];
            break;
        }       
    }
    let randdata=Math.floor(Math.random()*RWACategory.length);
    try {
        const contract=new ethers.Contract(RWAFactory.address,RWAFactory.abi,wallet);
        const txResponse=contract.createToken(wallet_name,'ITEM',wallet_name,RWACategory[randdata].count,RWACategory[randdata].hex)
        await walletContract(txResponse);
        
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }  

}
//safeMint函数过程
async function safeMint(wallet){
    console.log(`mintNFT过程。。。。。。。。。。。。。。。。`);
    const PerchyProxy='0xFED8e6fD3d616079558df4F6Adcda0a3C3c7245E';///合约地址
    let txData = {
        to: PerchyProxy,
        data: '0x6871ee40',
        value: 0,
    };
    await walletSendtxData(wallet,txData);
}
//predictPrice函数
async function predictPrice(wallet){
    console.log(`竞猜过程。。。。。。。。。。。。。。。。。。。。。`);
    let retries=0;
    let maxRetries=9;
    // const array_predict=range(0,25,1);
    const array_predict_rand=getRandomUniqueIndices(range(0,26,1));
    for (let index = 0; index < 2; index++) {
        try {
            const contract=new ethers.Contract(OracleGame.address,OracleGame.abi,wallet);
            const txResponse=contract.predictPriceMovement(array_predict_rand[index],Math.random()>0.5?0:1);
            if(await walletContract(txResponse)==null) retries++;
            if (retries>maxRetries) break;
            await sleep(1);//停顿3s         
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }   
    }
}
//kuma函数
const mintAICK_F=async(wallet)=>{
    console.log(`mint KUMA过程。。。。。。。。。。。。。。。。。。。。。`);
    try {
        const contract=new ethers.Contract(mintAICK.address,mintAICK.abi,wallet);
        const response=contract.mintAICK()
        return await walletContract(response);
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }  
}
const get_tokenId_F=async(hash)=>{
    await sleep(5);
    let retries=0;
    let maxRetries=4;
    let token='';
    while (retries <maxRetries) {
        const url=`https://plume-testnet.explorer.caldera.xyz/api/v2/transactions/${hash}`
        console.log(url);
        try {
            const response= await axios.get(url)//,{headers:headers})//,{headers:headers})
            // const transactionResponse= await Promise.race([
            //     response,
            //     new Promise((_,reject)=>setTimeout(()=>reject(new Error('TimeOut')),timeout))                
            // ]);
            token=response.data.token_transfers[0].total.token_id;
            console.log(`nft的token ID数据是：${token}`);   
            retries=maxRetries;
            return parseInt(token);
        } catch (error) {
            retries++;
            if(retries >= maxRetries){
                return null;
            }
            console.error(`开始尝试第${retries}次`);
        }    
    }
}
const KUMABondToken_F=async(wallet,tokenId)=>{  
    // tokenId=1855310;
    try {
        const contract=new ethers.Contract(KUMABondToken.address,KUMABondToken.abi,wallet);
        const response=contract.approve(KUMASwap.address,tokenId)
        await walletContract(response);
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }  
}
const KUMASwap_F=async(wallet,tokenId)=>{ 
    // tokenId=1855310;
    await sleep(2);
    try {
        const contract=new ethers.Contract(KUMASwap.address,KUMASwap.abi,wallet);
        const response=await contract.sellBond(tokenId)
        await walletContract(response);
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
    console.log(`KUMA完成。。。。。。。。。。。。。。。。。。。。。`);
}

//swap和stake函数
//合约地址集合
const goonUSD_address='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';//合约地址
const GOON_address='0xbA22114ec75f0D55C34A5E5A3cf384484Ad9e733';//合约地址
const CrocSwapDex_address='0x4c722A53Cf9EB5373c655E1dD2dA95AcC10152D1';//合约地址
const spender=`0xda2f2d62fe27553bd3d6f26e2685a92b069aa0bd`//授权合约地址
const elyfi_spender=`0xbb8a5ece08499c5ecf06d1a394260c12fd09fb83`//授权合约地址

//GOON转化为goonUSD函数
async function GOON_goonUSD_SWAP(GOON_amount,wallet){
    console.log(`Swap进行approve。。。。。。。。。。。。。。。。。。`);
    let address=wallet.address;
    let base_address='0x5c1409a46cd113b3a667db6df0a8d7be37ed3bb3';
    let quote_address='0xba22114ec75f0d55c34a5e5a3cf384484ad9e733';
    //approve程序
    let randdata=ethers.parseEther(GOON_amount.toString());
    let approve_transactionData = `0x095ea7b3${formHexData(CrocSwapDex_address.substring(2))}${formHexData(BigInt(randdata).toString(16))}`;
    let txData = {
        from:address,
        to: GOON_address,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);

    //swap程序
    //随机数量
    //1 GOON =999.08 goonUSD
    randdata=GOON_amount*0.07;
    console.log(`Swap过程，GOON_amount的数量是${randdata}`);

    let minOut=randdata*999.08*0.93;
    let qty=ethers.parseEther(randdata.toString());
    let minOut_BIGINT=ethers.parseEther(minOut.toString());

    approve_transactionData = `0x3d719cd9${formHexData(base_address.substring(2))}${formHexData(quote_address.substring(2))}${'0'.repeat(60)}8ca0${'0'.repeat(64)}${'0'.repeat(64)}${formHexData(BigInt(qty).toString(16))}${'0'.repeat(64)}${'0'.repeat(59)}10001${formHexData(BigInt(minOut_BIGINT).toString(16))}${'0'.repeat(64)}`;
    txData = {
        from:address,
        to: CrocSwapDex_address,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);
}
//swap函数
async function goonUSD_Stake(LP_amount,wallet){
    console.log(`Nest:Stable-LP进行approve。。。。。。。。。。。。。。。。。。`);
    let address=wallet.address;
    let TransparentUpgradeableProxy='0xA34420e04DE6B34F8680EE87740B379103DC69f6';
    let approve_transactionData = `0x095ea7b3${formHexData(TransparentUpgradeableProxy.substring(2))}${formHexData(BigInt(LP_amount).toString(16))}`;
    let txData = {
        from:address,
        to: goonUSD_address,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);

    console.log(`Nest :Stable-LP进行stake。。。。。。。。。。。。。。。。。。`);
    let stake_txData = {
        to: TransparentUpgradeableProxy, 
        data: `0xa694fc3a${formHexData(BigInt(LP_amount).toString(16))}`,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,stake_txData);
}
//领取stake的token
async function claimF(wallet){
    console.log(`Nest:提取奖励里程。。。。。。。。。。。。。。。。。。`);
    try {
        const contract=new ethers.Contract(NestStaking.address,NestStaking.abi,wallet);
        const txResponse=contract.claim();//此步不需要增加await，不然在下一步会报错误
        await walletContract(txResponse);   
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    } 
}

//mysticfinance函数
async function mysticfinance_goonUSD_Approve_Stake(wallet){
    console.log(`mysticfinance:Stable-LP进行approve。。。。。。。。。。。。。。。。。。`); 
    const amount=ethers.parseEther((Math.floor(Math.random()*10)+3).toString());
    let approve_txData = {
        to: goonUSD_address, 
        data: `0x095ea7b3${formHexData(spender.substring(2))}${formHexData(BigInt(amount).toString(16))}`,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,approve_txData);

    console.log(`mysticfinance:Stable-LP进行stake。。。。。。。。。。。。。。。。。。`);
    const arg0=`0xe55bb0aecbe4ae6bd9643818e4e04183980ef98a`;
    const arg1=`0x5c1409a46cd113b3a667db6df0a8d7be37ed3bb3`;
    let stake_txData = {
        to: spender, 
        data: `0x0c0a769b${formHexData(arg0.substring(2))}${formHexData(arg1.substring(2))}${formHexData(BigInt(amount).toString(16))}`,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,stake_txData);
}
//elyfi.world函数
async function elyfi_world_goonUSD_Approve_Stake(wallet){
    console.log(`elyfi.world:Stable-LP进行approve。。。。。。。。。。。。。。。。。。`);
    const amount=ethers.parseEther((Math.floor(Math.random()*10)+3).toString());
    let approve_txData = {
        to: goonUSD_address, 
        data: `0x095ea7b3${formHexData(elyfi_spender.substring(2))}${formHexData(BigInt(amount).toString(16))}`,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,approve_txData);

    console.log(`elyfi.world:Stable-LP进行stake。。。。。。。。。。。。。。。。。。`);
    let stake_txData = {
        to: elyfi_spender, 
        data: `0x6e553f65${formHexData(BigInt(amount).toString(16))}${formHexData(wallet.address.substring(2))}`,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,stake_txData);
}
//solidvioletF函数
async function solidvioletF(wallet){
    const address=wallet.address;
    console.log(`solidviolet的approve过程。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';
    const spender=`0x06107c39d3fd57a059bc4abae09f3b2b3d75d64e`;
    const randdata=Math.floor(Math.random()*(5-1)+1);
    const txData = {
        to: Interacted_contract_Token, 
        data: `0x095ea7b3${formHexData(spender.substring(2))}${formHexData(BigInt(ethers.parseEther(randdata.toString())).toString(16))}`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`solidviolet的deposit过程。。。。。。。。。。。。。。。。。。`);
    const arg0="0x06107c39d3fd57a059bc4abae09f3b2b3d75d64e";
    const arg1="0x5c1409a46cd113b3a667db6df0a8d7be37ed3bb3";
    const arg2="0x4194dddfb5938293621e78dd72e9bb22e59515d0";
    const txContract=[[`${address}`,`${arg0}`,`${arg1}`,`${(randdata*10**18).toString()}`,`${arg2}`,`${(randdata*10**6).toString()}`,'0','0'],[[`${arg1}`,`0xa9059cbb0000000000000000000000004181803232280371e02a875f51515be57b215231${formHexData(BigInt(ethers.parseEther(randdata.toString())).toString(16))}`,'0'],[`${arg2}`,`0x40c10f1900000000000000000000000006107c39d3fd57a059bc4abae09f3b2b3d75d64e${formHexData(BigInt((randdata*10**6).toString()).toString(16))}`,'0']]];
    // console.log(txContract);
    
    try {
        const contract=new ethers.Contract(solidviolet.address,solidviolet.abi,wallet);
        const txResponse=contract.executeSwap(txContract)
        await walletContract(txResponse);
        
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }  

}
//musicprotocolF函数
async function musicprotocolF(wallet){
    const address=wallet.address;
    console.log(`musicprotocol的approve过程。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';
    const spender=`0x712516e61C8B383dF4A63CFe83d7701Bce54B03e`;
    const randdata=Math.floor(Math.random()*(5-1)+1);
    let txData = {
        to: Interacted_contract_Token, 
        data: `0x095ea7b3${formHexData(spender.substring(2))}${formHexData(BigInt(ethers.parseEther(randdata.toString())).toString(16))}`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`musicprotocol的deposit过程。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: spender, 
        data: `0xd96a094a${formHexData(BigInt(ethers.parseEther(randdata.toString())).toString(16))}`,
        value: 0,
    };
    await walletSendtxData(wallet,txData); 

}
//realtyxF函数
async function realtyxF(wallet){
    const address=wallet.address;
    console.log(`realtyx ust的approve过程。。。。。。。。。。。。。。。。。。`);
    let Interacted_contract_Token='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';
    let spender=`0x67268653D34F7b95008DF76cd80DA7a0087572B2`;
    // const randdata=Math.floor(Math.random()*(5-1)+1);
    let txData = {
        to: Interacted_contract_Token, 
        data: `0x095ea7b300000000000000000000000067268653d34f7b95008df76cd80da7a0087572b20000000000000000000000000000000000000000000000008ac7230489e80000`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`realtyx ust的deposit过程。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: spender, 
        data: `0xa6b26387`,
        value: 0,
    };
    await walletSendtxData(wallet,txData); 

    Interacted_contract_Token='0xFB28084E8145976122A7d4415e1E41e7E4dB8531';
    spender=`0x67268653D34F7b95008DF76cd80DA7a0087572B2`;
    // const randdata=Math.floor(Math.random()*(5-1)+1);
    txData = {
        to: spender, 
        data: `0x095ea7b3000000000000000000000000fb28084e8145976122a7d4415e1e41e7e4db853100000000000000000000000000000000000000000000000002c68af0bb140000`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`realtyx的deposit过程。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: Interacted_contract_Token, 
        data: `0xa0712d6800000000000000000000000000000000000000000000000002c68af0bb140000`,
        value: 0,
    };
    await walletSendtxData(wallet,txData); 

}
const main=async(privateKeys)=>{
    const limit = pLimit(CONCURRENCY_LIMIT);

    //签到
    const tasks_qiandao=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.plumerpc));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await QianDAO(Plume_wallet);   
        })
     );
     await Promise.allSettled(tasks_qiandao)
     .then(()=>
         console.log(`任务已完成`)
     )
     .catch(error=>{
         console.error(error.message);
     });

    //其余任务
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.plumerpc));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await vote(Plume_wallet);
            await sleep(2);
            await Arc(Plume_wallet); 
            await sleep(2);
            // await safeMint(Plume_wallet);//24h后才可以mint
            // await sleep(1);
            await predictPrice(Plume_wallet);
            //kuma函数
            const hash=await mintAICK_F(Plume_wallet);
            const tokenId= await get_tokenId_F(hash);
            await KUMABondToken_F(Plume_wallet,tokenId);
            await sleep(2);
            await KUMASwap_F(Plume_wallet,tokenId);    
            //swap和stake
            if(privateKeys.length<20){
                await solidvioletF(Plume_wallet);
                await sleep(2);
                const GOON_amount=await getTokenBalance(GOON_address,bulbaswapWETHABI,Plume_wallet);
                await GOON_goonUSD_SWAP(GOON_amount,Plume_wallet);
                await sleep(2);  
                const goonUSD_Stable_LP_amount=await getTokenBalance(goonUSD_address,bulbaswapWETHABI,Plume_wallet);
                console.log(`goonUSD_Stable_LP_amount的数量是${goonUSD_Stable_LP_amount}`);
                const LP_goonUSD_amount=ethers.parseEther((Math.floor(goonUSD_Stable_LP_amount)-50).toString());
                await goonUSD_Stake(LP_goonUSD_amount,Plume_wallet);
                await sleep(1);
                await claimF(Plume_wallet);    
                await sleep(1);
                await mysticfinance_goonUSD_Approve_Stake(Plume_wallet)
                await sleep(1);
                await elyfi_world_goonUSD_Approve_Stake(Plume_wallet);   
                await sleep(1);
                await musicprotocolF(Plume_wallet);   
                await sleep(1);
                await realtyxF(Plume_wallet);   
            } 
        })
     );
     await Promise.allSettled(tasks)
     .then(()=>
         console.log(`任务已完成`)
     )
     .catch(error=>{
         console.error(error.message);
     });
}

main(NewPrivatKeys(PrivateKeys$136Wallets)).catch(error=>{
    console.error(error.message);  
})
