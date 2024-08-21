export default function Next({ ...props }) {
  const { className } = props;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="#fff"
      className={className}
    >
      <path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z" />
    </svg>
  );
}
