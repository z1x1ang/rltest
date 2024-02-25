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
    chooseAction2(observation){
        this.checkStateExist(observation);
        if(Math.random()<this.epsilon){
            //以ε-greedy策略选择动作
            const stateAction=this.q_table[observation]
            const maxIndex=stateAction.reduce((maxIndex,currentValue,currentIndex,array)=>
            currentValue>array[maxIndex] ? currentIndex : maxIndex,0);
            const action=this.actions[maxIndex];
            return action;
        }
        else{
            //以一定概率随机选择动作
            const randomIndex=Math.floor(Math.random()*this.actions.length)
            return this.actions[randomIndex];
        }
    }
    chooseAction(observation) {
        this.checkStateExist(observation); // 确保状态存在
        if (Math.random() < this.epsilon) {
            // ε-greedy 策略选择动作
            const stateActionValues = this.q_table[observation];
            const maxIndex = stateActionValues.reduce((maxIndex, currentValue, currentIndex, array) =>
                currentValue > array[maxIndex] ? currentIndex : maxIndex, 0);
            return this.actions[maxIndex]; // 根据最大价值选择动作
        } else {
            // 随机选择动作
            const randomIndex = Math.floor(Math.random() * this.actions.length);
            return this.actions[randomIndex];
        }
    }
    
}


class QLearningTable extends RL{
    constructor(actions,learning_rate=0.01,reward_decay=0.9,e_greedy=0.5){
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
    constructor(actions,learning_rate=0.01,reward_decay=0.9,e_greedy=0.9){
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
