import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton({ label = "Retour" }) {
  const navigate = useNavigate();

  return (
    <button type="button" className="back-button" onClick={() => navigate(-1)}>
      ← {label}
    </button>
  );
}