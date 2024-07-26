import Maze from './Maze.js'
import { SarsaTable, QLearningTable } from './RL_brain.js';

let METHOD;

 async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

function get_action(flag){
    if(flag){
        const optimal_path=[5,10,11,12,17]
        const gridItems=document.getElementsByClassName('grid-item');
        for(const i in optimal_path){
            gridItems[optimal_path[i]].style.backgroundColor='rgba(0,255,0,0.3)';
        }
    }
}
function get_policy(q_table){
let flag=false;
const optimal_policy={0:1,5:1,10:3,11:3,12:1,17:1}
for(const state in optimal_policy){
    const maxValue=Math.max(...q_table[state]);
    const maxIndexes = q_table[state].reduce((indexes, currentValue, currentIndex) => {
        if (currentValue === maxValue) {
            indexes.push(currentIndex);
        }
        return indexes;
    }, []);
    if(maxIndexes.length==1&&maxIndexes[0]==optimal_policy[state])
    {
        flag=true;

    }
    else {
        flag=false;
        break;
    }
}
if(flag){
    get_action(flag)
    return optimal_policy;
}
else return null;
}

async function update(){
    for(let episode=0;episode<100;episode++){
        //初始化装态
        let observation=env.reset()

        let c=0;

        let tmp_policy={}

        while(true){
            //基于当前状态S选择行为A
            let action=RL.chooseAction(observation)

            let state_item=observation

            tmp_policy[state_item]=action

            //采取行为获得下一个状态和回报，以及是否终止
            let {s_:observation_,reward,done,oval_flag}=env.step(action)
            await delay(50);  // 延时50毫秒    
            if(METHOD=="SARSA"){
                //基于下一个状态选择行为
                let action_=RL.chooseAction(observation_)
                //基于变化(s,a,r,s',a')使用Sarsa进行Q更新
                RL.learn(observation,action,reward,observation_,action_)
            }
            else if(METHOD=="Q-Learning"){
                //根据当前变化更新Q
                RL.learn(observation,action,reward,observation_)
            }

            //改变状态和行为
            observation=observation_;

            c+=1;

            RL.updateEpsilon(episode);
            //如果为终止状态，结束当前的局数
            if(done) break;

        }
    }
    env.reset();
    console.log("100局游戏结束")
    //输出最终Q表
    let q_table_result=RL.q_table;
    //使用Q表输出各状态最优策略
    let policy = get_policy(q_table_result)
    policy?console.log("最优策略已收敛:",policy):console.log("最优策略未收敛");
    console.table(q_table_result);
}


function main() {
    window.env = new Maze(); // 假设Maze是一个有效的类
    // 根据所选择的方法初始化RL实例
    if(METHOD==='SARSA'){
        window.RL=new SarsaTable(env.action_space);
    }
    else if(METHOD==='Q-Learning'){
        window.RL=new QLearningTable(env.action_space);
    }
    // 启动更新过程
    update();
}

// 确保DOM完全加载后再运行主函数
document.addEventListener('DOMContentLoaded', function() {
    // 选择按钮
    const sarsaButton = document.querySelector('.sarsa');
    const qlearningButton = document.querySelector('.qlearning');
    const mp3Button=document.querySelector(".mp3play")
    const videoButton=document.querySelector('.videoplay')
    // 获取视频元素
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    // 获取音乐元素
    const km3=document.getElementById('mySong')
    
    //切换相关变量
    let isPlayingmp3 = false; // 初始状态为暂停
    let isPlayingmp4 = false; // 初始状态为暂停

    videoButton.addEventListener('click',()=>{
        if(!isPlayingmp4){
        video1.play();
        video2.play();
        videoButton.innerHTML="暂停播放"
    }
    else{
        video1.pause();
        video2.pause();
        videoButton.innerHTML="播放视频"

    }
    isPlayingmp4=!isPlayingmp4;
    })

    //监听MP3按钮
    mp3Button.addEventListener('click',function(){
        if(!isPlayingmp3){
          km3.volume = 0.5; // 设置音量为50%
          km3.play()
          mp3Button.innerHTML="暂停播放"
        }
        else{
            km3.pause();
            mp3Button.innerHTML="播放音乐"
        }
        isPlayingmp3=!isPlayingmp3;
    })
    // 为SARSA按钮添加点击事件监听器
    sarsaButton.addEventListener('click', function() {
        METHOD = "SARSA";
        main(); // 调用main函数启动SARSA
    });

    // 为Q-Learning按钮添加点击事件监听器
    qlearningButton.addEventListener('click', function() {
        METHOD = "Q-Learning";
        main(); // 调用main函数启动Q-Learning
    });
});
