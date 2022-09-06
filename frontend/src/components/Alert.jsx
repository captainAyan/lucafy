export default function Alert(props) {
  const { type, message } = props;
  return (
    <div className={`alert alert-${type} shadow-lg`}>
      <div>
        <span>{message}</span>
      </div>
    </div>
  );
}
