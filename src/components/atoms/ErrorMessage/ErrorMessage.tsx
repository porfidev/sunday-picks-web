/**
 * Created by porfidev on 16/02/26
 */

import './ErrorMessage.styles.css';

type ErrorMessageProps = {
  error: string;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className={'error-message'}>
      <span className={'material-icons error-message__icon'} aria-hidden={'true'}>
        report_problem
      </span>
      <span className={'error-message__text'}>{error}</span>
    </div>
  );
}
