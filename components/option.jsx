export const OptionComposant = ({
  option: options,
  className,
  text,
  name,
  onchange,
  value,
}) => {
  return (
    <div>
      <div>
        <select className={className} onChange={onchange} name={name} id="">
          <option className="text-black" value="">
            {text}
          </option>
          {options.map((items) => (
            <option className="text-black" key={items.id} value={items}>
              {items.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
