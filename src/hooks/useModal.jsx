import { useState, useEffect } from 'react';

export default function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const open = () => setIsModalOpen(true);
  const close = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return;

    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, [isModalOpen]);

  return { isModalOpen, open, close };
}
