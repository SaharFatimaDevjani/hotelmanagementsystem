import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to an error reporting service here
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-100 rounded-xl mt-8">
          <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong.</h2>
          <pre className="text-red-600">{this.state.error && this.state.error.toString()}</pre>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;