type ButtonProps = {
    title: string;
    onClick: () => void
  };
  
  const Button: React.FC<ButtonProps> = (props) => {
    return (
      <div onClick={props.onClick} className="w-80 h-12 bg-primary hover:bg-hover active:bg-active justify-items-center content-center rounded-lg shadow-md mb-2 lg:w-120 lg:h-15">
        <p className="text-white tracking-wider text-center">{props.title}</p>
      </div>
    );
  };
  export default Button;
  