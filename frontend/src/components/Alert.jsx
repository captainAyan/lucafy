export default function Alert(props) {
  const { message } = props;
  return (
    <div className={`alert alert-error`}>
      <div>
        <span>{message}</span>
      </div>
    </div>
  );
}
