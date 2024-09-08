import {ethers} from 'ethers';
// import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';
import pLimit from 'p-limit';
import fs from 'fs'

const CONCURRENCY_LIMIT=20;
// const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
// const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//获取token数量
const provider_url=`https://testnet-rpc.plumenetwork.xyz/http`;
async function walletSendtxData(wallet,txData,maxRetries = 4,timeout=50000){
    let retries = 0;
    let success = false;
    while (retries < maxRetries) {
        try {
            const txPromise = wallet.sendTransaction(txData);
            const transactionResponse= await Promise.race([
                txPromise,
                new Promise((_,reject)=>setTimeout(()=>reject(new Error('TimeOut')),timeout))                
            ]);
            const receipt = await transactionResponse.wait();
            if (receipt.status===1) {
              console.log("交易sucess，hash是:",receipt.hash); 
              retries=maxRetries;
              success=true;
            }else{
              throw new Error(`交易hash是failed，从新进行交易`);              
            }
            await sleep(2)         
            return 0;
        } catch (error) {
            // console.error(`Error occurred: ${error.message}`);//暂时屏蔽掉错误信息
            retries++;
            // console.error(`开始尝试第${retries}次,${error.message}`);
            console.error(`开始尝试第${retries}次`);
            if(retries >= maxRetries){
              console.log(`尝试${maxRetries}次仍然失败，退出交易`);
              // console.error(`kayakfinance领取测试币发生错误,开始尝试第${retries}次`);
              return 1;
                // throw new Error('Max retries exceeded'); 
            }
            await sleep(1);//等待3s时间
        }         
    }
}


//打乱钱包顺序
function NewPrivatKeys(privateKeys) {
    // 用一个新数组来保存随机取出的数值
    let shuffled_PrivateKeys = [];
  
    // 随机取值直到取完所有数组元素
    while (privateKeys.length > 0) {
        // 生成一个随机索引
        let randomIndex = Math.floor(Math.random() * privateKeys.length);
        // 从原数组中取出随机的元素
        let randomNum = privateKeys[randomIndex];
        // 将取出的元素加入新数组
        shuffled_PrivateKeys.push(randomNum);
        // 从原数组中移除已经取出的元素
        privateKeys.splice(randomIndex, 1);
    }
    // console.log(shuffled_PrivateKeys);
    return shuffled_PrivateKeys;
  }

//定时器
const  sleep = (seconds) => {
    let milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
//RPC生成器
const RPC_provider=async(rpc)=>{
    let retries=0;
    let maxRetries=4;
    let provider=null;
    while (retries<maxRetries) {
      try {
          provider= new ethers.JsonRpcProvider(rpc);//设置链接PRC
          return provider;//设置链接PRC
      } catch (error) {
          retries++;
          console.error(`网络provider链接失败，开始尝试第${retries}次`);
          await sleep(2);
      } 
    }
    throw new Error("provider连接失败，达到最大重试次数");
  }

  /**
 * 读取 TXT 文件，并去掉每一行中的 \r 字符
 * @param {string} filePath - TXT 文件的路径
 * @returns {Promise<string[]>} - 返回一个包含每一行内容的数组
 */
function readTxtFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('读取文件出错: ' + err);
                return;
            }
            // 将文件内容按行分割成数组，并去掉每行的 \r 字符
            const lines = data.split('\n').map(line => line.replace(/\r/g, ''));
            resolve(lines);
        });
    });
  }
async function QianDAO(wallet){
    // console.log(`每天领取测试代币。。。。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x8Dc5b3f1CcC75604710d9F464e3C5D2dfCAb60d8';
    const txData = {
        to: Interacted_contract_Token, 
        data: `0x183ff085`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
}

const main=async(privateKeys)=>{
    console.log(`当前时间是：${new Date()}`);
    const limit = pLimit(CONCURRENCY_LIMIT);
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(provider_url));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await QianDAO(Plume_wallet);   
            await sleep(3);
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

main(NewPrivatKeys(await readTxtFile('hhplume.txt'))).catch(error=>{//path文件地址，里面是密钥
console.error(error.message);  
})