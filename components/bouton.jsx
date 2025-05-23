export const Bouton = ({ name, className, onClick, type }) => {
  return (
    <div>
      <button type={type} onClick={onClick} className={className}>
        {name}{" "}
      </button>
    </div>
  );
};
