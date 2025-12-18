import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Legacy route shim: keep /login working but use the single Auth page.
const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth?mode=login', { replace: true });
  }, [navigate]);

  return null;
};

export default Login;
