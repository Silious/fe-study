
import React from 'react';
//import ErrorBoundary from './ErrorBoundary';
import { ErrorBoundary } from 'react-error-boundary'
const LazyUser = React.lazy(() => import('./User'));

class Suspense extends React.Component {
  state = { loading: false };
  //组件捕获到了异常
  componentDidCatch(error) {
    // 如果捕获到的error是一个promise的话
    if (typeof error.then === 'function') {
      //先把loading设置为true
      this.setState({ loading: true });
      //等promise完成
      error.then(() => { this.setState({ loading: false }) });
    }
  }
  render() {
    const { fallback, children } = this.props;
    const { loading } = this.state;
    return loading ? fallback : children;
  }
}
class SuspensePage extends React.Component {
  render() {
    return (
      <>
        <div>header</div>
        <Suspense fallback={<div>loading user....</div>}>
          <ErrorBoundary>
            <LazyUser />
          </ErrorBoundary>
        </Suspense>
        <div>footer</div>
      </>
    )
  }
}

export default SuspensePage;