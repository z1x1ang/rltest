    import Maze from './Maze.js'
    import { SarsaTable, QLearningTable } from './RL_brain.js';

    let METHOD;

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function update() {
        // 收敛标记
        let flag = false;
        // 连续N次达到宝藏位置，即为收敛
        let N = 3;
        // 相似次数
        let count = 0;
        // 初始化一个随机策略
        let policy = {};
        // 记录局数
        let episode_num = 0;
        // 记录总步数
        let step_num = 0;
        for (let episode = 0; episode < 100; episode++) {
            // 初始化状态
            let observation = env.reset();
            let c = 0;
            let tmp_policy = {};
            while (true) {
                let action = RLInstance.chooseAction(observation);
                const state_item = observation;
                tmp_policy[state_item] = action;
                // 采取行为获得下一个状态和回报,及是否终止
                let {s_:observation_, reward, done, oval_flag} = env.step(action);
                await delay(50);  // 延时100毫秒
                // 在这里添加延时来实现动画效果
                if (METHOD === "SARSA") {
                    // 基于下一个状态选择行为
                    let action_ = RLInstance.chooseAction(observation_);
                    // 基于变化 (s, a, r, s', a') 使用Sarsa进行Q的更新
                    RLInstance.learn(observation,action,reward, observation_, action_);
                }
                else if(METHOD==='Q-Learning'){
                    RLInstance.learn(observation,action,reward,observation_)
                }
                    // 改变状态和行为
                    observation = observation_;
                    c += 1;
                    // 如果为终止状态
                    if (done) {
                        episode_num = episode;
                        step_num += c;
                        console.log(policy);
                        console.log("*".repeat(50));
                        // 如果N次行走的策略相同，表示已经收敛
                        if (JSON.stringify(policy) == JSON.stringify(tmp_policy) && oval_flag) {
                            count += 1;
                            if (count == N) {
                                flag = true;
                            }
                        } else {
                            count = 0;
                            policy = tmp_policy;
                        }
                        break;
                    }
                
            }
            if (flag) break;
        } 

        if (flag) {
            console.log("=".repeat(50));
            console.log(`算法${METHOD}在${episode_num}局时收敛,总步数为:${step_num}`);
            console.log('最优策略输出:');
            console.log(policy);
            console.table(RLInstance.q_table);
            // 在界面上进行展示
            env.reset();
            env.render_by_policy(policy);
        }
        if (!flag) {
            // 达到设置的局数, 终止游戏
            console.log(`算法${METHOD}未收敛,但达到了100局,游戏结束`);
            console.table(RLInstance.q_table);
            // 在界面上进行展示
            env.reset();
        }
    
        
    }
    function main() {
        window.env = new Maze(); // 假设Maze是一个有效的类
        // 根据所选择的方法初始化RL实例
        if(METHOD==='SARSA'){
            window.RLInstance=new SarsaTable(env.action_space);
        }
        else if(METHOD==='Q-Learning'){
            window.RLInstance=new QLearningTable(env.action_space);
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
