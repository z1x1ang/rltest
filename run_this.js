import Maze from './Maze.js'
import RL from './RL_brain.js'
let METHOD = "SARSA";
const env = new Maze(); // 创建迷宫环境实例
async function update(RLInstance) {
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
              // 在这里添加延时来实现动画效果
              await new Promise(resolve => setTimeout(resolve, 100)); // 例如，等待100毫秒
            if (METHOD == "SARSA") {
                // 基于下一个状态选择行为
                let action_ = RLInstance.chooseAction(observation_);
                // 基于变化 (s, a, r, s', a') 使用Sarsa进行Q的更新
                RLInstance.learn(observation, action, reward, observation_, action_);
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
                    if (JSON.stringify(policy) === JSON.stringify(tmp_policy) && oval_flag) {
                        count += 1;
                        if (count == N) {
                            flag = true;
                        }
                    } else {
                        count = 0;
                        policy = tmp_policy;
                    }
                    console.log("执行到这个附近，画面产生变形");
                    break;
                }
            }
            if (flag) break;
            
        }//while终止
        if (flag) {
            console.log("=".repeat(50));
            console.log(`算法${METHOD}在${episode_num}局时收敛,总步数为:${step_num}`);
            console.log('最优策略输出:');
            console.log(policy);
    
            // 在界面上进行展示
            env.reset();
            env.render_by_policy(policy);
            break; // 如果已经收敛，则不需要继续循环
        }
    } //大循环终止

    if (!flag) {
        // 达到设置的局数, 终止游戏
        console.log(`算法${METHOD}未收敛,但达到了100局,游戏结束`);
        //env.destroy();
        // 在界面上进行展示
        env.reset();
    }
    
}
function main() {
    // 假设 actions 参数是动作的数量，这里需要根据你的环境具体情况设置
    let actions = [0, 1, 2, 3]; // 例如，对于上、下、左、右的动作
    // 根据所选择的方法初始化RL实例
    let RLInstance  = new RL(actions);
    // 启动更新过程
    update(RLInstance);
}
// 确保DOM完全加载后再运行主函数
if (document.readyState === 'loading') {  // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', main);
} else {  // `DOMContentLoaded` has already fired
    main();
}