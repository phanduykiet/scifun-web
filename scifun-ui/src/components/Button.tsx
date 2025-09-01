type Props = {
  text: string;
  type?: "button" | "submit";
  variant?: "primary" | "success" | "warning" | "info" | "danger" | "secondary" | "dark" | "light";
};

export default function Button({ text, type = "button", variant = "primary" }: Props) {
  return (
    <button type={type} className={`btn btn-${variant} w-100`}>
      {text}
    </button>
  );
}
