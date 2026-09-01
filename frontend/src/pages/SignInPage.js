import React, { useState } from 'react';
import SignInCard from '../components/SignInCard';
import SignUpCard from '../components/SignUpCard';

const SignInPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return isLoginView ? (
    <SignInCard onToggle={toggleView} />
  ) : (
    <SignUpCard onToggle={toggleView} />
  );
};

export default SignInPage;