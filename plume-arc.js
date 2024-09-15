import { ethers } from 'ethers';
import RWAFactory from './Contract/RWAFactory.json' assert { type: 'json' };
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
import { walletContract, RPC_provider } from '../../util/common.js';
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import pLimit from 'p-limit';

// 你的代码逻辑

// import pLimit from 'p-limit';
const CONCURRENCY_LIMIT=20;
// const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
// const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//获取token数量
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
const main=async(privateKeys)=>{

    // const pLimit = await import('p-limit');
    const limit = pLimit(CONCURRENCY_LIMIT);
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.plumerpc));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await Arc(Plume_wallet);   
        })
     );
    await Promise.all(tasks);
    console.log('所有任务已完成');

    // for (let index = 0; index <privateKeys.length; index++) {//PrivateKeys$18Wallets.length 1 3-10 14 17 18 1 678910 14
    //     let Plume_wallet=new ethers.Wallet(privateKeys[index],await RPC_provider(RPC.plumerpc));
    //     console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
    //     await Arc(Plume_wallet);    
    // }
}

main(PrivateKeys$136Wallets)