import cn from 'classnames';

import styles from './index.module.less';

function Hello({ className, name }: HelloProps) {
  return <div className={cn(styles.container, className)}>Hello {name} z2hujing</div>;
}

Hello.defaultProps = {
  className: '',
};

export interface HelloProps {
  className?: string;
  name: string;
}

export default Hello;