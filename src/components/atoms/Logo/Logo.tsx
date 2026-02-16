/**
 * Created by porfidev on 16/02/26
 */

import './Logo.styles.css';

type LogoProps = {
  alt?: string;
};

export function Logo({ alt = 'Logo Sunday Picks' }: LogoProps) {
  return (
    <div className={'logo'}>
      <img src={'/icons/logo.svg'} alt={alt} className={'logo__image'} />
    </div>
  );
}
