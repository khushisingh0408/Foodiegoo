import "../css/Hero.css";
import heroImage from "../assets/images/hero.png";
import { useNavigate } from "react-router-dom";

function Hero({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();

  const handleSearch = () => {
    const value = searchTerm.trim();

    if (value !== "") {
      navigate(`/search?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <section className="hero">

      <div className="hero-left">
        <h1>Delivered Fast 🚀</h1>

        <p>
          Order your favourite food from the best restaurants near you.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search your favourite food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>

        <button className="order-btn">
          Order Now
        </button>
      </div>

      <div className="hero-right">
        <img src={heroImage} alt="Hero Food" />
      </div>

    </section>
  );
}

export default Hero;