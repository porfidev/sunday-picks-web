/**
 * Created by porfidev on 16/02/26
 */

import './SectionTitle.styles.css';
import type { ReactNode } from 'react';

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <h1 className={'section-title'}>{children}</h1>;
}
