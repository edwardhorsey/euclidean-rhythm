import React, { useState, useContext } from 'react';

export const WebAudioContext = React.createContext(null);

export const WebAudio = ({ children }) => {
  const [context] = useState(() => new AudioContext());

  return (
    <WebAudioContext.Provider value={context}>
      {children}
    </WebAudioContext.Provider>
  );
};

export const useWebAudio = () => useContext(WebAudioContext);
