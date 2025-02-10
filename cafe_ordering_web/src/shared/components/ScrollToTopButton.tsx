'use client';

import React, { useState, useEffect, RefObject } from 'react';
import IconButton from '@mui/material/IconButton';
import { ArrowUpwardRounded } from '@mui/icons-material';

interface ScrollToTopButtonProps {
  scrollableRef: RefObject<HTMLDivElement | null>;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ scrollableRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableRef.current) {
        const scrollTop = scrollableRef.current.scrollTop;
        const docHeight =
          scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Sayfa %3'ten fazla kaydırıldıysa düğmeyi göster, aksi halde gizle
        setIsVisible(scrollPercent > 3);
      }
    };

    const scrollableDiv = scrollableRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollableRef]);

  return (
    <>
      {isVisible && (
        <IconButton

          sx={{ backgroundColor: 'turquoise' }}
          color='warning'
          className="z-50"
          style={{ position: 'fixed', right: 30, bottom: 70 }}
          onClick={handleClick}
        >
          <ArrowUpwardRounded color="primary" />
        </IconButton>
      )}
    </>
  );
};

export default ScrollToTopButton;
