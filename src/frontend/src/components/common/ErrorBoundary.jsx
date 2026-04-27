import React from 'react';
import { FaExclamationTriangle, FaHome, FaSync } from 'react-icons/fa';

/**
 * ErrorBoundary - Catches React component errors and displays fallback UI
 * Prevents entire app from crashing due to component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external service if needed
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-red-600 text-4xl" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Oops! Đã có lỗi
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 mb-4 text-sm">
              Ứng dụng gặp một lỗi không mong muốn. Chúng tôi đang khắc phục.
            </p>

            {/* Error Details (Dev Mode Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-32">
                <p className="text-xs text-gray-700 font-mono mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Component Stack
                    </summary>
                    <pre className="text-xs whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FaSync className="text-lg" />
                Thử lại
              </button>
              <a
                href="/"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FaHome className="text-lg" />
                Về trang chủ
              </a>
            </div>

            {/* Support Text */}
            <p className="text-xs text-gray-500 mt-6">
              Nếu vấn đề tiếp tục, hãy liên hệ hỗ trợ
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
