"use client";

import React from "react";

export default class DesignerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // no-op; could log to an endpoint
    // console.error('Designer crashed', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border rounded text-sm text-red-700 bg-red-50">
          <div className="font-medium mb-1">Designer failed to load</div>
          <div className="opacity-80">{String(this.state.error?.message || this.state.error || 'Unknown error')}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

