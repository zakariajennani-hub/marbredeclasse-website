import { useState } from "react";
import "./ProductGallery.css";

export default function ProductGallery({ product }) {
  const images = [
    product.image,
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <section className="product-gallery">
      <div className="gallery-main-image">
        <img src={activeImage} alt={product.name} />
      </div>

      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <button
            className={
              activeImage === image
                ? "gallery-thumb active"
                : "gallery-thumb"
            }
            key={index}
            onClick={() => setActiveImage(image)}
          >
            <img src={image} alt={`${product.name} ${index + 1}`} />
          </button>
        ))}
      </div>
    </section>
  );
}