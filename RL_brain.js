class RL{
    constructor(actions,learning_rate=0.01,reward_decay=0.9,e_greedy=0.9){
        this.actions=actions;
        this.lr=learning_rate;
        this.gamma=reward_decay;
        this.epsilon=e_greedy;
        this.q_table={};//Q表用对象表示
        this.i=0;
    }

    checkStateExist(state)
    {
        if(!this.q_table[state]){
            //如果当前状态在Q表中不存在，将其加入Q表
            this.q_table[state]=Array.from({length:this.actions.length},()=>0);
        }
    }
    //observation 某个状态state，0,1,2,3
    chooseAction(observation) {
        this.checkStateExist(observation); // 确保状态存在
        //从均匀分布的[0,1)中随机采样,当小于阈值时采用选择最优行为的方式,当大于阈值选择随机行为的方式,这样人为增加随机性是为了解决陷入局部最优
        if (Math.random() < this.epsilon) {
            // ε-greedy 策略选择动作
            const stateActionValues = this.q_table[observation];
            // 找出最大值
            const maxValue = Math.max(...stateActionValues);
            // 找出所有最大值的索引
            const maxIndexes = stateActionValues.reduce((indexes, currentValue, currentIndex) => {
                if (currentValue === maxValue) {
                    indexes.push(currentIndex);
                }
                return indexes;
            }, []);
        // 从最大值索引中随机选择一个
        const randomIndex = maxIndexes[Math.floor(Math.random() * maxIndexes.length)];
        return this.actions[randomIndex]; // 根据最大价值随机选择动作
        } else {
            // 随机选择动作
            const randomIndex = Math.floor(Math.random() * this.actions.length);
            return this.actions[randomIndex];
        }
    }
}


class QLearningTable extends RL{
    constructor(actions,learning_rate,reward_decay,e_greedy){
        super(actions,learning_rate,reward_decay,e_greedy)
    }
    learn(s,a,r,s_){
        this.checkStateExist(s_);
        const qPredict=this.q_table[s][this.actions.indexOf(a)];
        const qTarget=s_!=='terminal'?
            r + this.gamma * Math.max(...Object.values(this.q_table[s_])) :
            r;
        this.q_table[s][this.actions.indexOf(a)]+=this.lr*(qTarget-qPredict)
    }
}

class SarsaTable extends RL{
    constructor(actions,learning_rate,reward_decay,e_greedy){
        super(actions,learning_rate,reward_decay,e_greedy)
    }
    learn(s,a,r,s_,a_){
        //Sarsa算法的学习过程
        this.checkStateExist(s_);
        const qPredict = this.q_table[s][this.actions.indexOf(a)];
        const qTarget = s_ !== 'terminal' ?
          r + this.gamma * this.q_table[s_][this.actions.indexOf(a_)]:
          r;
        this.q_table[s][this.actions.indexOf(a)] += this.lr * (qTarget - qPredict);
    }
}
export { SarsaTable, QLearningTable };
