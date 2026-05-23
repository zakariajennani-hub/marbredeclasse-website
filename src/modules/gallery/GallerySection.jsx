import "./GallerySection.css";

export default function GallerySection({ product }) {
  const inspirations = [
    {
      id: 1,
      title: "Salle de bain",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop",
    },

    {
      id: 2,
      title: "Escalier",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop",
    },

    {
      id: 3,
      title: "Cuisine",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
    },

    {
      id: 4,
      title: "Salon moderne",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <span>Inspirations</span>

        <h2>Applications du {product.name}</h2>

        <p>
          Découvrez comment ce matériau peut transformer
          les espaces résidentiels et professionnels.
        </p>
      </div>

      <div className="gallery-grid">
        {inspirations.map((item) => (
          <div className="gallery-card" key={item.id}>
            <img src={item.image} alt={item.title} />

            <div className="gallery-overlay">
              <h3>{item.title}</h3>

              <button>Voir inspiration</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}