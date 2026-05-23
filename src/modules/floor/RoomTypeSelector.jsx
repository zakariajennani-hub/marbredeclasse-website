import "./RoomTypeSelector.css";

const roomTypes = [
  {
    id: "salon",
    title: "Salon",
    recommendation: "60×60 conseillé",
    description: "Grand format pour un rendu moderne et spacieux.",
  },
  {
    id: "chambre",
    title: "Chambre",
    recommendation: "40×40 ou 60×60",
    description: "Format équilibré pour un espace calme et élégant.",
  },
  {
    id: "salle_bain",
    title: "Salle de bain",
    recommendation: "40×40 conseillé",
    description: "Format pratique avec possibilité de finition antidérapante.",
  },
  {
    id: "cuisine",
    title: "Cuisine",
    recommendation: "60×60 conseillé",
    description: "Format résistant et facile à entretenir.",
  },
  {
    id: "terrasse",
    title: "Terrasse",
    recommendation: "60×30 conseillé",
    description: "Effet allongé et rendu extérieur élégant.",
  },
  {
    id: "bureau",
    title: "Bureau",
    recommendation: "60×60 conseillé",
    description: "Aspect professionnel, propre et premium.",
  },
];

export default function RoomTypeSelector({
  selectedRoom,
  setSelectedRoom,
}) {
  return (
    <section className="room-type-selector">
      <div className="room-type-header">
        <span>TYPE D’ESPACE</span>
        <h3>Où souhaitez-vous poser ce sol ?</h3>
      </div>

      <div className="room-type-grid">
        {roomTypes.map((room) => (
          <button
            key={room.id}
            className={
              selectedRoom === room.id
                ? "room-type-card active"
                : "room-type-card"
            }
            onClick={() => setSelectedRoom(room.id)}
          >
            <strong>{room.title}</strong>
            <span>{room.recommendation}</span>
            <p>{room.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}