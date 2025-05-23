export const Tableau = ({ entete, body, sujet, className, classNametable }) => {
  return (
    <div className={className}>
      <div>
        <strong>{sujet}</strong>
      </div>

      <table className={classNametable}>
        <thead>
          <tr>{entete}</tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
};
