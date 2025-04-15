
import { useEffect, useState, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

interface LottieSplashProps {
  animationPath: string;
  onComplete?: () => void;
}

export const LottieSplash = ({ animationPath, onComplete }: LottieSplashProps) => {
  const [visible, setVisible] = useState(true);
  const playerRef = useRef<Player>(null);
  
  useEffect(() => {
    // Hide the splash after animation completes or times out
    const timeout = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000); // Adjust timeout as needed
    
    return () => clearTimeout(timeout);
  }, [onComplete]);
  
  // Instead of trying to use addEventListener, we'll handle animation completion
  // via the onComplete prop in the Player component
  
  if (!visible) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0066FF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <Player
        ref={playerRef}
        autoplay
        loop={false}
        src={animationPath}
        style={{ width: '80%', maxWidth: '300px' }}
        onComplete={() => {
          setVisible(false);
          if (onComplete) onComplete();
        }}
      />
    </div>
  );
};
