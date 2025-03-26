import React from "react";
import "./CardItem.css"; // Import the external CSS file

interface CardProps {
  card: {
    id: number;
    title: string;
    image?: string; // Add image property
    onClick: () => void;
  };
}

const CardItem: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="card-item" onClick={card.onClick}>
      {/* Display Image */}
      {card.image && <img src={card.image} alt={card.title} className="card-image" />}
      <h5 className="card-title">{card.title}</h5>
    </div>
  );
};

export default CardItem;
