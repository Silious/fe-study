
//是否批量更新
let isBatchingUpdate = false;
let updateQueue = [];
let state = { number: 0 };
function setState(newState) {
  if (isBatchingUpdate) {
    updateQueue.push(newState);
  } else {
    state = newState;
  }
}
const handelClick = () => {
  setState({ number: state.number + 1 });//1
  console.log(state.number);
  setState({ number: state.number + 1 });//1
  console.log(state.number);
  // 0 0 updateQueue[1,1]
  setTimeout(() => {
    setState({ number: state.number + 1 });
    console.log(state.number);
    setState({ number: state.number + 1 });
    console.log(state.number);
  });
}

function batchedUpdate(fn) {
  isBatchingUpdate = true;//进入批量模式
  fn();
  isBatchingUpdate = false;//退出批量更新模式
  updateQueue.forEach(newState => {
    state = newState;
  });
  //state=1
  updateQueue.length = 0;
}
batchedUpdate(handelClick);