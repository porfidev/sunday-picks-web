/**
 * Created by porfidev on 16/02/26
 */

import './MainTemplate.styles.css';
import type { ReactNode } from 'react';

type MainTemplateProps = {
  children: ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  return <div className={'main-template'}>{children}</div>;
}
