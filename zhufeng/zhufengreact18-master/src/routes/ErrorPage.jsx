
import React from 'react';
import { fetchUser } from '../fakeApi';
function ErrorPage(props) {
  React.useEffect(() => {
    (async function () {
      //此处就可以写异步代码，推荐使用async await 
      try {
        let user = await fetchUser(1);
        console.log(user);
      } catch (err) {
        console.log(err);
      }
    })();
  });
  return <div>ErrorPage</div>
}
export default ErrorPage;