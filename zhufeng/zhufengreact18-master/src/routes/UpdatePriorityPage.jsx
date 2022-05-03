
import React, { useEffect, startTransition } from 'react';
function UpdatePriorityPage() {
  let [state, setState] = React.useState('');
  useEffect(() => console.log(state));
  /**
   * 每次渲染的时候会有一个渲染优先级。找到优先级最高的进行渲染作为渲染优先级。
   * 渲染的时候 会渲染比这个优先级高的更新
   * 虽然优先级不同，但最终的结果的顺序和调用的顺序是严格一致的
   */
  const update = () => {
    //走二次
    // BD
    // ABCD
    startTransition(() => setState(state => state + 'A'))
    setState(state => state + 'B');
    startTransition(() => setState(state => state + 'C'))
    setState(state => state + 'D');
  }
  return (
    <>
      <div>{state}</div>
      <button onClick={update}>更新</button>
    </>
  )
}
export default UpdatePriorityPage;