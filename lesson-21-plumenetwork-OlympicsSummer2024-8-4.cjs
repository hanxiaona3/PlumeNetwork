const ethers=require('ethers')
const axios=require('axios')
const bulbaswapWETHABI = require('../config/bulbaswapWETHABI.json');
const bulbaswapNativeRouterABI = require('../config/bulbaswapNativeRouterABI.json');
const {PrivateKeys$18Wallets,PrivateKeys$4Wallets,地址1,地址2}=require('../util/privateKey.cjs');
const SWAP_UTIL=require('../util/swaptoken.cjs');
const {NewPrivatKeys,sleep,formHexData_two,getRandomUniqueIndicesFromLast,walletSendtxData}=require('../util/common.cjs')
const fakeUa = require('fake-useragent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const RPC=require('../config/runnerRPC-1.json');

// const chalk = require("chalk");
// import chalk from 'chalk';

// const holesky_PRC='https://g.w.lavanet.xyz:443/gateway/hol1/rpc-http/a175064ed506e16c12597b7e8d24d73e';//'https://ethereum-holesky.publicnode.com';

// const provider=new ethers.JsonRpcProvider(PRC);

const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
const date_temp='8月1日奥林匹林';
const OlympicsSummer2024=`4f6c796d7069637353756d6d657232303234`;
const MedalCount_MostTotalMedalsAug1=`4d6564616c436f756e742d4d6f7374546f74616c4d6564616c7341756731`;
const MedalCount_MostGoldMedalsAug1= `4d6564616c436f756e742d4d6f7374476f6c644d6564616c7341756731`;
const MedalCount_MostSilverMedalsAug1=`4d6564616c436f756e742d4d6f737453696c7665724d6564616c7341756731`;
const MedalCount_MostBronzeMedalsAug1=`4d6564616c436f756e742d4d6f737442726f6e7a654d6564616c7341756731`;

const team_nation=`7465616d2d6e6174696f6e`;
const China=`4368696e61`;
const United_States=`556e6974656420537461746573`;
//获取token数量
async function QianDAO(wallet){
    // console.log(`每天领取测试代币。。。。。。。。。。。。。。。。。。。。。`);
    const address=wallet.address;
    const Interacted_contract_Token='0x9B89349CF95111367990eAF2C1a7aBBFB100D3Ef';

    let retries=0;
    /**      **/
    let datas=[
        {descript:'Medal Count Most Total Medal Count',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d6572323032340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e4d6564616c436f756e742d4d6f7374546f74616c4d6564616c73417567340000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d556e697465642053746174657300000000000000000000000000000000000000`},
        {descript:'Medal Count Most Gold Medal Count',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d6572323032340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d4d6564616c436f756e742d4d6f7374476f6c644d6564616c7341756734000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000054368696e61000000000000000000000000000000000000000000000000000000`},
        {descript:'Medal Count Most Silver Medal Count',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d6572323032340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f4d6564616c436f756e742d4d6f737453696c7665724d6564616c734175673400000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d556e697465642053746174657300000000000000000000000000000000000000`},
        {descript:'Medal Count Most Bronze Medal Count',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d6572323032340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f4d6564616c436f756e742d4d6f737442726f6e7a654d6564616c734175673400000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d556e697465642053746174657300000000000000000000000000000000000000`},
        {descript:'Womens Group Phase - Group C',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d657232303234000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000164261736b657462616c6c2d576f6d656e2d44453a555300000000000000000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025553000000000000000000000000000000000000000000000000000000000000`},
        {descript:'Mens Pool Round',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d65723230323400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018337833204261736b657462616c6c2d4d656e2d46523a434e0000000000000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002434e000000000000000000000000000000000000000000000000000000000000`},
        {descript:'Womens Preliminary Round - Group A',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d65723230323400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016576174657220506f6c6f2d576f6d656e2d48553a415500000000000000000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024155000000000000000000000000000000000000000000000000000000000000`},
        {descript:'Womens Preliminary Round - Group B',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d65723230323400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016576174657220506f6c6f2d576f6d656e2d49543a455300000000000000000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024954000000000000000000000000000000000000000000000000000000000000`},
        {descript:'Womens Preliminary Round - Pool A',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d65723230323400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016566f6c6c657962616c6c2d576f6d656e2d46523a555300000000000000000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025553000000000000000000000000000000000000000000000000000000000000`},
        {descript:'Womens Preliminary Round - Pool A',hex:`0x0fff4c90000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000124f6c796d7069637353756d6d65723230323400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016566f6c6c657962616c6c2d576f6d656e2d434e3a525300000000000000000000000000000000000000000000000000000000000000000000000000000000000b7465616d2d6e6174696f6e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002434e000000000000000000000000000000000000000000000000000000000000`},
    
    ];
    // let vote_number=Math.floor(Math.random()*(datas.length)+4);//奥运会每日项目投票数量
    const vote_number=(wallet.address==地址1||wallet.address==地址2)?datas.length:Math.floor(Math.random()*(datas.length-4)+4);
    console.log(`投票项目数量是：${vote_number}`);
    
    let randNumber_datas=getRandomUniqueIndicesFromLast(datas,datas.length-4);//[0,1,2,3,6,7,5,4]
    for (let index = 0; index < vote_number; index++) {
        if (retries>=5) {break;}//跳出循环，说明这个钱包已经做过对应的处理
        console.log(`第${index+1}个比赛项目是：${datas[randNumber_datas[index]].descript}`);
        let txData = {
            to: Interacted_contract_Token, 
            data:datas[randNumber_datas[index]].hex,
            value: 0,
        };
        retries += await walletSendtxData(wallet,txData);
    }
    await sleep(10);
}


const main=async(privateKeys)=>{

    // const shuffled_PrivateKeys=NewPrivatKeys(privateKeys);

    for (let index = 14; index < privateKeys.length ; index++) {//PrivateKeys$18Wallets.length
        let Plume_wallet=new ethers.Wallet(privateKeys[index],Plume_Testnet_Provider);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        await QianDAO(Plume_wallet);    
    }
}

main(PrivateKeys$18Wallets)
