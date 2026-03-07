/**
 * Created by porfidev on 16/02/26
 */

import './MainTemplate.styles.css';
import { type ReactNode } from 'react';
import { AppHeader } from '../../organisms/AppHeader';

type MainTemplateProps = {
  children: ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className={'main-template'}>
      <AppHeader />
      <div className={'main-template__content'}>{children}</div>
    </div>
  );
}
