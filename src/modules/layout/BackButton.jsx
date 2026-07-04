import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton({
  label = "Retour",
  to = null,
}) {
  const navigate = useNavigate();

  function handleClick() {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  }

  return (
    <button
      type="button"
      className="back-button"
      onClick={handleClick}
    >
      ← {label}
    </button>
  );
}