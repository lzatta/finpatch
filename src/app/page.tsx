import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecionando...</p>
    </div>
  );
}
