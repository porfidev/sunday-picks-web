import type { ReactNode } from 'react';
import './AuthTemplate.styles.css';

type MainLayoutProps = {
  children: ReactNode;
};

export function AuthTemplate({ children }: MainLayoutProps) {
  return (
    <>
      <div className={'main-layout'}>
        <div className={'field-lines'}></div>
        <div className={'hash-marks'}></div>
        {children}
      </div>
    </>
  );
}
