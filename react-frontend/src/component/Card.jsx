import "./styles/cards.css";

function Card({ name, description }) {
  return (
    <div className="card">
      <h1>{name}</h1>
      <p> {description}</p>
    </div>
  );
}

export default Card;