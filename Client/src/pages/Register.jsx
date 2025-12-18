import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Legacy route shim: keep /register working but use the single Auth page.
const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth?mode=register', { replace: true });
  }, [navigate]);

  return null;
};

export default Register;
