import React, { useState } from 'react';

// Props için interface tanımı
interface MyComponentProps {
  initialCount: number;
  label?: string; // Opsiyonel prop
}

// State için interface tanımı
interface MyComponentState {
  count: number;
}

// Fonksiyonel bileşen tanımı
const MyComponent: React.FC<MyComponentProps> = ({ initialCount, label = 'Sayaç' }) => {
  // State tanımı
  const [state, setState] = useState<MyComponentState>({ count: initialCount });

  // Butona tıklandığında sayacı artıran fonksiyon
  const increment = () => {
    setState((prevState) => ({ count: prevState.count + 1 }));
  };

  return (
    <div>
      <h1>{label}</h1>
      <p>Mevcut Sayı: {state.count}</p>
      <button onClick={increment}>Artır</button>
    </div>
  );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(MyComponent);
