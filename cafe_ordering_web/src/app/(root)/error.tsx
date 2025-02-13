'use client'

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  // Yeni hata oluştuğunda state'i güncelleyerek fallback UI'yi göstermek için kullanılır.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Hata detaylarını loglamak için kullanılabilir.
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary yakaladığı hata:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Burada kullanıcıya gösterilecek yedek UI'yi belirleyebilirsiniz.
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Bir hata oluştu!</h1>
          <p>Üzgünüz, bu sayfayı görüntülerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
