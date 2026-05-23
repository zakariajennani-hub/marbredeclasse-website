import "./HomeTestimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Client à Rabat",
    project: "Plan de cuisine en quartz",
    text: "Service sérieux, mesures précises et finition propre. Le résultat final a donné un aspect très premium à la cuisine.",
  },
  {
    id: 2,
    name: "Client à Casablanca",
    project: "Sol en marbre format 60×60",
    text: "Le choix du format et le calcul du devis étaient clairs. L’équipe a bien expliqué les pertes, la pose et la livraison.",
  },
  {
    id: 3,
    name: "Client à Temara",
    project: "Table basse sur mesure",
    text: "La pièce a été réalisée avec beaucoup de soin. Le choix de la pierre et la finition ont vraiment changé le style du salon.",
  },
];

export default function HomeTestimonials() {
  return (
    <section className="home-testimonials">
      <div className="testimonials-header">
        <span>AVIS CLIENTS</span>
        <h2>Ils nous ont fait confiance</h2>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((item) => (
          <div className="testimonial-card" key={item.id}>
            <p>“{item.text}”</p>

            <div>
              <strong>{item.name}</strong>
              <span>{item.project}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}