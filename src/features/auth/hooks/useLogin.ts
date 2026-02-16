import { useState } from 'react';

export type LoginRequestValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function useLogin() {
  const [values, setValues] = useState<LoginRequestValues>({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const submit = async () => {
    setLoading(true);
    console.log('ingresando a submit', loading);
    try {
      await sleep(1000);
    } finally {
      console.log('fin submit', loading);
      setLoading(false);
    }
  };

  return {
    values,
    setValues,
    showPassword,
    setShowPassword,
    loading,
    submit,
  };
}
