/**
 * Created by porfidev on 16/02/26
 */

import type { CSSProperties } from 'react';
import './Logo.styles.css';

type LogoProps = {
  alt?: string;
  width?: number | string;
  height?: number | string;
};

export function Logo({ alt = 'Logo Sunday Picks', width, height }: LogoProps) {
  const containerStyle: CSSProperties = {};
  const imageStyle: CSSProperties = {};

  if (width) {
    containerStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  if (height) {
    containerStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  if (width || height) {
    imageStyle.width = '62.5%';
    imageStyle.height = '62.5%';
  }

  return (
    <div className={'logo'} style={containerStyle}>
      <img src={'/icons/logo.svg'} alt={alt} className={'logo__image'} style={imageStyle} />
    </div>
  );
}
