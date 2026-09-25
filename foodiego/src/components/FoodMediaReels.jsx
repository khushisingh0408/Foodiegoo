import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Flame,
  Star,
  Clock,
  CircleDot,
  Info,
  ArrowRight
} from "lucide-react";
import { foodReels } from "../data/foodMediaData";
import { foods } from "../data/foodsData";
import { CartContext } from "../context/CartContext";
import "../css/FoodMediaReels.css";

function FoodMediaReels() {
  const navigate = useNavigate();
  const { addToCart, showToast } = useContext(CartContext);

  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [likedReels, setLikedReels] = useState({});
  const [showChefInfo, setShowChefInfo] = useState(false);

  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const activeReel = activeReelIndex !== null ? foodReels[activeReelIndex] : null;

  // Open modal for a specific reel
  const handleOpenReel = (index) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    setProgress(0);
    setShowChefInfo(false);
  };

  // Close reel modal
  const handleCloseReel = () => {
    setActiveReelIndex(null);
    setIsPlaying(false);
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Next Reel
  const handleNextReel = () => {
    if (activeReelIndex !== null) {
      const nextIdx = (activeReelIndex + 1) % foodReels.length;
      setActiveReelIndex(nextIdx);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  // Prev Reel
  const handlePrevReel = () => {
    if (activeReelIndex !== null) {
      const prevIdx = (activeReelIndex - 1 + foodReels.length) % foodReels.length;
      setActiveReelIndex(prevIdx);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Like Toggle
  const toggleLike = (reelId) => {
    setLikedReels((prev) => {
      const isLiked = !prev[reelId];
      if (isLiked) {
        showToast("Added to your favorite food media!", "success");
      }
      return { ...prev, [reelId]: isLiked };
    });
  };

  // Share Reel
  const handleShareReel = (reel) => {
    const url = `${window.location.origin}/product/${reel.dishId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`Link to ${reel.title} copied to clipboard!`, "success");
    } else {
      showToast(`Sharing ${reel.title}!`, "info");
    }
  };

  // Add Dish to Cart from Reel
  const handleAddDish = (dishId) => {
    const foodItem = foods.find((f) => f.id === dishId) || foods[0];
    addToCart(foodItem);
    showToast(`Added ${foodItem.name} directly to your cart! 🛒`, "success");
  };

  // Progress update
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  // Video ended - go to next
  const handleVideoEnded = () => {
    handleNextReel();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeReelIndex === null) return;
      if (e.key === "Escape") handleCloseReel();
      if (e.key === "ArrowRight") handleNextReel();
      if (e.key === "ArrowLeft") handlePrevReel();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") toggleMute();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelIndex, isPlaying, isMuted]);

  return (
    <section className="food-media-reels-section">
      <div className="reels-header-row">
        <div className="reels-title-block">
          <div className="reels-badge-pill">
            <Flame size={13} className="inline-icon flame-icon" /> SIZZLE STORIES & REELS
          </div>
          <h2>Foodie Shorts & Kitchen Sizzle</h2>
          <p>Watch 15-second mouth-watering food videos & order directly from the stream</p>
        </div>
        <div className="reels-meta-stats">
          <span className="live-pulse-indicator">
            <span className="pulse-dot"></span> LIVE TASTING
          </span>
        </div>
      </div>

      {/* Horizontal Story Rings Carousel */}
      <div className="reels-story-scroll">
        {foodReels.map((reel, idx) => (
          <div
            key={reel.id}
            className="story-ring-card"
            onClick={() => handleOpenReel(idx)}
          >
            <div className="story-ring-border">
              <div className="story-thumb-wrapper">
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="story-thumb-img"
                  loading="lazy"
                />
                <div className="story-play-overlay">
                  <Play size={18} fill="#ffffff" color="#ffffff" />
                </div>
                <span className="story-tag-mini">{reel.tag.split(" ")[0]}</span>
              </div>
            </div>
            <div className="story-info-text">
              <h5 className="story-name">{reel.title}</h5>
              <span className="story-price-tag">{reel.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Sizzle Reel Video Modal */}
      {activeReel && (
        <div className="reel-modal-overlay" onClick={handleCloseReel}>
          <div className="reel-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Top Multi-Story Progress Bars */}
            <div className="reel-progress-bar-container">
              {foodReels.map((r, i) => (
                <div key={r.id} className="reel-progress-segment">
                  <div
                    className="reel-progress-fill"
                    style={{
                      width:
                        i < activeReelIndex
                          ? "100%"
                          : i === activeReelIndex
                          ? `${progress}%`
                          : "0%"
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Reel Header */}
            <div className="reel-top-bar">
              <div className="reel-restaurant-badge">
                <img src={activeReel.avatar} alt={activeReel.restaurant} className="reel-rest-img" />
                <div>
                  <h4>{activeReel.restaurant}</h4>
                  <span className="reel-cat-pill">{activeReel.category}</span>
                </div>
              </div>

              <div className="reel-top-actions">
                <button
                  className="reel-icon-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  className="reel-icon-btn close-btn"
                  onClick={handleCloseReel}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Video Viewport */}
            <div className="reel-video-wrapper" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={activeReel.videoUrl}
                poster={activeReel.thumbnail}
                autoPlay
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className="reel-video-element"
              />

              {!isPlaying && (
                <div className="reel-paused-scrim">
                  <div className="play-circle-center">
                    <Play size={36} fill="#ffffff" color="#ffffff" />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            <button
              className="reel-nav-btn prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevReel();
              }}
              aria-label="Previous story"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              className="reel-nav-btn next-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNextReel();
              }}
              aria-label="Next story"
            >
              <ChevronRight size={22} />
            </button>

            {/* Right Side Floating Social Actions */}
            <div className="reel-floating-sidebar">
              <button
                className={`reel-side-btn ${likedReels[activeReel.id] ? "liked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(activeReel.id);
                }}
              >
                <Heart
                  size={22}
                  fill={likedReels[activeReel.id] ? "#ef4444" : "none"}
                  color={likedReels[activeReel.id] ? "#ef4444" : "#ffffff"}
                />
                <span>{likedReels[activeReel.id] ? "Liked!" : activeReel.likes}</span>
              </button>

              <button
                className="reel-side-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareReel(activeReel);
                }}
              >
                <Share2 size={20} color="#ffffff" />
                <span>{activeReel.shares}</span>
              </button>

              <button
                className={`reel-side-btn ${showChefInfo ? "active-info" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChefInfo(!showChefInfo);
                }}
              >
                <Info size={20} color="#ffffff" />
                <span>Secrets</span>
              </button>
            </div>

            {/* Chef Tasting Secrets Popup */}
            {showChefInfo && (
              <div className="reel-chef-secrets-overlay" onClick={(e) => e.stopPropagation()}>
                <div className="chef-secrets-header">
                  <Sparkles size={16} color="#fbbf24" />
                  <h5>Chef Tasting & Prep Notes</h5>
                  <button onClick={() => setShowChefInfo(false)}>
                    <X size={14} />
                  </button>
                </div>
                <p>{activeReel.chefNote}</p>
                <div className="secret-hashtags">
                  {activeReel.hashtags.map((ht, i) => (
                    <span key={i} className="secret-tag">{ht}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Dish Order Card */}
            <div className="reel-bottom-card" onClick={(e) => e.stopPropagation()}>
              <div className="dish-meta-left">
                <div className="dish-reel-title-row">
                  <span className="reel-tag-pill">{activeReel.tag}</span>
                  <span className="reel-rating-pill">
                    <Star size={11} fill="#fbbf24" stroke="#fbbf24" /> {activeReel.rating}
                  </span>
                </div>
                <h3>{activeReel.title}</h3>
                <div className="dish-specs-row">
                  <span><Clock size={12} /> {activeReel.prepTime}</span>
                  <span><Flame size={12} /> {activeReel.calories}</span>
                  <span className="dish-price-strong">{activeReel.price}</span>
                </div>
              </div>

              <div className="dish-actions-right">
                <button
                  className="reel-add-btn"
                  onClick={() => handleAddDish(activeReel.dishId)}
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>
                <Link
                  to={`/product/${activeReel.dishId}`}
                  className="reel-details-btn"
                  onClick={handleCloseReel}
                >
                  Details <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FoodMediaReels;
