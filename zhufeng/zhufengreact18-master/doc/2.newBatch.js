
let updateQueue = [];
let state = { number: 0 }
let InputPriority = 1;//输入优先级 数字 越小，优先级越高
let NormalPriority = 2;//普通 优先级
let lastPriority;

function setState(newState, priority) {
  updateQueue.push(newState);
  if (lastPriority === priority) {
    return;
  }
  lastPriority = priority
  setTimeout(() => {
    updateQueue.forEach(newState => {
      state = newState;
    });
    updateQueue.length = 0;
  });
}
//在React18是否批量更新依赖，而是依赖更新的优先级
const handelClick = () => {
  setState({ number: state.number + 1 }, InputPriority);
  console.log(state.number);
  setState({ number: state.number + 1 }, InputPriority);
  console.log(state.number);
  setTimeout(() => {
    setState({ number: state.number + 1 }, NormalPriority);
    console.log(state.number);
    setState({ number: state.number + 1 }, NormalPriority);
    console.log(state.number);
  });
}
handelClick();