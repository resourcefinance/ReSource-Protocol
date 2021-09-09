import React from "react"
import SomethingWentWrongPage from "../../pages/SomethingWentWrongPage"

type Props = {}

type State = { hasError: boolean }

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error, errorInfo) {
    return { ...this.state }
  }

  render() {
    if (this.state.hasError) {
      return <SomethingWentWrongPage />
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
