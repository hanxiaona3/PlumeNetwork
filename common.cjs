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

  //ethersjs中字符串变为16进制
  const convertToHexa = (str = '') =>{
    return `0x${Buffer.from(str).toString('hex')}`
  }
  //ethersjs中数字变为16进制
  const convertNumToHexa = (num) =>{
    return Number(num).toString(16);
  }

//16进制数据制造机器，0在前面
function formHexData(string) {
  if (typeof string !== 'string') {
      return '';
      throw new Error('Input must be a string.');
  }

  if (string.length > 64) {
      return '';
      throw new Error('String length exceeds 64 characters.');
  }

  return '0'.repeat(64 - string.length) + string;
}

//16进制数据制造机器,0在后面
function formHexData_two(string) {
  if (typeof string !== 'string') {
      return '';
      throw new Error('Input must be a string.');
  }

  if (string.length > 64) {
      return '';
      throw new Error('String length exceeds 64 characters.');
  }

  return string + '0'.repeat(64 - string.length) ;
}

//拼接交易的data数据
function transactionData(amount, id, signature){
  const amountData = formHexData(BigInt(amount).toString(16))//.toString(16))
  const idData = Buffer.from(id).toString('hex')
  // console.log(idData);
  const transactionData = `0xf16aa7ae0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060${amountData}00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000035${idData}00000000000000000000000000000000000000000000000000000000000000000000000000000000000041${signature.substring(2)}00000000000000000000000000000000000000000000000000000000000000`;

  return transactionData;
}

// 如果想获得 [min, max], 可以使用 Math.floor(Math.random() * (max - min + 1)) + min;
// 如果想获得 [min, max）, 可以使用 Math.floor(Math.random() * (max - min )) + min;
// 如果想获得 (min, max], 可以使用 Math.ceil(Math.random() * (max - min )) + min;

const  sleep = (seconds) => {
    let milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };


  //记录与时间有关的函数
  const temp_date=()=>{
    //单独记录时间
    let temp1=new Date();
    //国际时间是
    let ios_date=temp1.toISOString();

    //13位数的时间
    let date_13=Date.now();
    //10位数的时间,有两种方式
    let date_10=Math.round(new Date().getTime()/1000);
    let date_10_1=Math.round(Date.now()/1000)

  }

  /**
   * 钱包发送交易程序，简化程序代码；
   * maxRetries为最大的尝试次数，默认是3次；
   * timeout为最大的时间周期,默认是10s，合约交互时间较长
   */

  async function walletSendtxData(wallet,txData,maxRetries = 3,timeout=25000){
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const txPromise = await wallet.sendTransaction(txData);
            const transactionResponse= await Promise.race([
                await txPromise.wait(),
                new Promise((_,reject)=>setTimeout(()=>reject(new Error('TimeOut')),timeout))                
            ]);
            // const receipt = await transactionResponse.wait();
            console.log("交易hash是:",transactionResponse.hash); 
            retries=maxRetries;
            await sleep(2)          
            return 0;
        } catch (error) {
            // console.error(`Error occurred: ${error.message}`);//暂时屏蔽掉错误信息
            retries++;
            if(retries >= maxRetries){
                // console.error(`kayakfinance领取测试币发生错误,开始尝试第${retries}次`);
                return 1;
                // throw new Error('Max retries exceeded'); 
            }
            console.error(`开始尝试第${retries}次`);
            await sleep(3);//等待3s时间
        }         
    }
}

  /**
   * Fisher-Yates 洗牌算法；
   * 获得数组不同下标
   */

  function getRandomUniqueIndices_Two(arr, numIndices) {
    // 创建包含所有下标的数组
    const indices = Array.from(arr.keys());   
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 随机选择下标
        [indices[i], indices[j]] = [indices[j], indices[i]]; // 交换
    }
    
    // 返回前 numIndices 个不重复的下标
    return indices.slice(0, numIndices);
}
  /**
   * Fisher-Yates 洗牌算法；
   * 获得数组不同下标
   */

  function getRandomUniqueIndices(arr) {
    // 创建包含所有下标的数组
    const indices = Array.from(arr.keys());   
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 随机选择下标
        [indices[i], indices[j]] = [indices[j], indices[i]]; // 交换
    }
    
    // 返回前 numIndices 个不重复的下标
    return indices;
}
  /**
   * Fisher-Yates 洗牌算法；
   * 固定前面几位，打乱后面几位下标
   */
function getRandomUniqueIndicesFromLast(arr,num) {
    if (arr.length < num) {
      throw new Error(`数组长度必须大于等于${num}`);
    }
    // 获取后 num 位的下标
    const lastFourIndices = Array.from({ length: num }, (_, i) => arr.length - num + i);

    // Fisher-Yates 洗牌算法随机打乱后 num 位的下标
    for (let i = lastFourIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lastFourIndices[i], lastFourIndices[j]] = [lastFourIndices[j], lastFourIndices[i]];
    }
    // 生成最终的下标数组
    const finalIndices = Array.from(arr.keys());
    // 将后 4 位的下标替换为随机的下标
    finalIndices.splice(finalIndices.length - num, num, ...lastFourIndices);
    
    return finalIndices;
}

module.exports={getRandomUniqueIndicesFromLast,getRandomUniqueIndices,walletSendtxData,convertNumToHexa,NewPrivatKeys,convertToHexa,sleep,formHexData,transactionData,formHexData_two};