/**
 * Created by porfidev on 16/02/26
 */

import './InputIcon.styles.css';

type InputIconProps = {
  type?: string;
};

export function InputIcon({ type }: InputIconProps) {
  if (type === 'password') {
    return <img className={'input-icon'} src={'/icons/lock_open.svg'} alt={'account icon'} />;
  }

  if (type === 'email') {
    return <img className={'input-icon'} src={'/icons/account_circle.svg'} alt={'account icon'} />;
  }

  if (type === 'eye') {
    return <img className={'input-icon'} src={'/icons/remove_eye.svg'} alt={'account icon'} />;
  }

  if (type === 'eye-closed') {
    return <img className={'input-icon'} src={'/icons/visibility_off.svg'} alt={'account icon'} />;
  }

  return null;
}
