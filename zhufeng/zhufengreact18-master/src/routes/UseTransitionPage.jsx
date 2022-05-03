
import React, { Suspense, useState, useTransition } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { fetchUser } from '../fakeApi'
import { wrapPromise } from '../utils';
const user1Promise = fetchUser(1);
const user1Resource = wrapPromise(user1Promise);
const user5Promise = fetchUser(5);
const user5Resource = wrapPromise(user5Promise);
function User({ resource }) {
  let user = resource.read();
  return (
    <div>{user.id}:{user.name}</div>
  )
}
function UseTransitionPage() {
  const [resource, setResource] = useState(user1Resource)
  const [isPending, startTransition] = useTransition();
  //只适用于那些加载特别快的地方
  const changeToUser5 = () => {
    //startTransition(() => {
    setResource(user5Resource);
    //});
  }
  return (
    <>
      <Suspense fallback={<div>loading user....</div>}>
        <ErrorBoundary>
          <User resource={resource} />
        </ErrorBoundary>
      </Suspense>
      <button onClick={changeToUser5}>切换到用户5</button>
      <div>{isPending && <div>loading</div>}</div>
    </>
  )
}

export default UseTransitionPage;