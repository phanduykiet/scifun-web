// src/components/PlanCard.tsx
import React from "react";

interface PlanCardProps {
  icon: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  icon,
  name,
  price,
  period,
  description,
  features,
  badge,
  onSelect,
}) => {
  return (
    <div className="plan-card position-relative">
      {badge && <span className="badge">{badge}</span>}
      <div className="plan-icon">{icon}</div>
      <h2 className="plan-name">{name}</h2>
      <div className="plan-price">
        <span className="price-amount">
          <span className="price-currency">đ</span>
          {price}
        </span>
        <span className="price-period">/{period}</span>
      </div>
      <p className="plan-description">{description}</p>
      <ul className="plan-features">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button className="plan-button w-100" onClick={onSelect}>
        Chọn {name}
      </button>
    </div>
  );
};

export default PlanCard;
