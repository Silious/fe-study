
import React, { Suspense } from 'react';
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }
  render() {
    if (this.state.hasError) {
      return this.state.error.errMsg
    } else {
      return this.props.children;
    }
  }
}
export default ErrorBoundary;