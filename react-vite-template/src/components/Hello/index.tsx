export interface HelloProps {
  className?: string;
  name: string;
}

function Hello({ className, name }: HelloProps) {
  return <div className={className}>Hello {name}</div>;
}

Hello.defaultProps = {
  className: '',
};

export default Hello;