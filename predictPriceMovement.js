import {ethers} from 'ethers'
import OracleGame from './Contract/OracleGame.json' assert { type: 'json' };
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import {PrivateKeys$18Wallets,PrivateKeys$136Wallets} from '../../util/privateKey.js';
import {walletContract, sleep,RPC_provider,range,NewPrivatKeys,getRandomUniqueIndices} from '../../util/common.js';
import pLimit from 'p-limit';

const CONCURRENCY_LIMIT=10;

//获取token数量
async function predictPrice(wallet){
    let retries=0;
    let maxRetries=7;
    // const array_predict=range(0,25,1);
    const array_predict_rand=getRandomUniqueIndices(range(0,25,1));
    for (let index = 0; index < array_predict_rand.length; index++) {
        try {
            const contract=new ethers.Contract(OracleGame.address,OracleGame.abi,wallet);
            const txResponse=contract.predictPriceMovement(array_predict_rand[index],Math.random()>0.5?0:1);
            if(await walletContract(txResponse)==null) retries++;
            if (retries>maxRetries) break;
            await sleep(2);//停顿3s         
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }   
    }
}
const main=async(privateKeys)=>{//8

    const limit = pLimit(CONCURRENCY_LIMIT);
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.plumerpc));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await predictPrice(Plume_wallet);   
        })
     );
     await Promise.allSettled(tasks)
     .then(()=>console.log(`任务已完成`));
}
main(NewPrivatKeys(PrivateKeys$136Wallets)).catch(error=>{
    console.error(error.message);  
})



// const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
// const Plume_Testnet_Provider=new ethers.JsonRpcProvider(RPC.plumerpc);//设置链接PRC

// while (array_predict.length>0) {
    //     let array_delete=removeRandomElement(array_predict);
    //     try {
//         const contract=new ethers.Contract(OracleGame.address,OracleGame.abi,wallet);
//         const txResponse=contract.predictPriceMovement(array_delete,Math.random()>0.5?0:1);
//         if(await walletContract(txResponse)==null) retries++;
//         if (retries>maxRetries) break;
//         await sleep(2);//停顿3s         
//     } catch (error) {
//         console.error(`Error occurred: ${error.message}`);
//     }      
// }