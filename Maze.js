class Maze{
constructor(){
//初始化主角位置
this.gridItems=document.getElementsByClassName('grid-item');
this.newDiv = document.createElement('div');
this.newDiv.className = 'q';
this.newDiv.style.backgroundColor='red';
this.reset();
//初始化陷阱位置
this.hell=[6,7,8,16,18,20,24];
//初始化宝藏位置
this.oval_pos=22;
    }
reset(){
   this.gridItems[0].appendChild(this.newDiv)
   return 0;
}
delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

step(action){
    // 找到当前方块的位置
    let currentIndex = Array.from(this.gridItems).findIndex(item => item.contains(this.newDiv));
    let s=currentIndex;
    let newIndex;
    switch(action){
    case 0:
        //向上移动
        newIndex=currentIndex>4?currentIndex-5:currentIndex;
        break;
    case 1:
        //向下移动
        newIndex=currentIndex<20?currentIndex+5:currentIndex;
        break;
    case 2:
        //向左移动
        newIndex=currentIndex%5!==0?currentIndex-1:currentIndex;
        break;
    case 3:
        //向右移动
        newIndex=(currentIndex+1)%5!=0?currentIndex+1:currentIndex;
        break;
    default:
        //不移动
        return;
}

let s_ = newIndex; // 移动后的新状态

//移动到新位置
this.gridItems[newIndex].appendChild(this.newDiv);
//根据当前位置来获得回报值,及是否终止
let reward, done, oval_flag = false;
if(s_==this.oval_pos){
    reward=1;
    done=true;
    s='terminal';
    oval_flag=true;
}

else if(this.hell.includes(s_)){
    reward=-1;
    done=true;
    s='terminal';
}
else 
{
reward=0;
done=false;
}
return {s_,reward,done,oval_flag}
}
//根据传入策略进行界面渲染
render_by_policy(){
    console.log("成功");
    }
}
export default Maze;
