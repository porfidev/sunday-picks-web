import type { ReactNode } from 'react';
import './AuthTemplate.styles.css';

type MainLayoutProps = {
  children: ReactNode;
};

export function AuthTemplate({ children }: MainLayoutProps) {
  return (
    <div className={'auth-template'}>
      <div className={'auth-template__field-lines'}></div>
      <div className={'auth-template__hash-marks'}></div>
      {children}
    </div>
  );
}
