import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error) {
    console.error('App error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-5">😬</div>
            <h1 className="font-display text-2xl font-extrabold text-gray-900">Something went wrong</h1>
            <p className="text-gray-500 text-sm mt-2">{this.state.message || 'An unexpected error occurred.'}</p>
            <div className="flex gap-3 justify-center mt-8">
              <button
                onClick={() => window.location.reload()}
                className="bg-brand-600 text-white font-bold px-8 py-3 rounded-full hover:bg-brand-700 transition"
              >
                Reload page
              </button>
              <button
                onClick={() => { this.setState({ hasError: false, message: '' }); window.location.href = '/' }}
                className="border-2 border-gray-200 font-bold px-8 py-3 rounded-full hover:border-gray-400 transition"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
