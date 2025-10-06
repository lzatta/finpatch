import { useEffect } from 'react';
import { useUIStore } from '@/store/ui';
import { useNavigate } from 'react-router-dom';

export function useGlobalHotkeys() {
  const { openAddTransactionModal, openAddGoalModal } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Ignore hotkeys if user is typing in an input, textarea, etc.
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case 'r':
          event.preventDefault();
          openAddTransactionModal('income');
          break;
        case 'd':
          event.preventDefault();
          openAddTransactionModal('expense');
          break;
        case 'g':
          event.preventDefault();
          openAddGoalModal();
          break;
        case 'f':
          event.preventDefault();
          navigate('/transactions');
          setTimeout(() => {
            document.getElementById('transaction-search')?.focus();
          }, 100);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openAddTransactionModal, openAddGoalModal, navigate]);
}
