/**
 * Created by porfidev on 16/02/26
 */

import './BrandTitle.styles.css';

type BrandTitleProps = {
  main: string;
  highlight?: string;
};

export function BrandTitle({ main, highlight }: BrandTitleProps) {
  return (
    <h1 className={'brand-title'}>
      {main}
      <span className={'brand-title__highlight'}>{highlight}</span>
    </h1>
  );
}
