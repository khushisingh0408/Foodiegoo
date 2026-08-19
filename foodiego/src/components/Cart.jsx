import "../css/Cart.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, food) =>
      total + Number(food.price.replace("₹", "")) * food.quantity,
    0
  );

  return (
    <section className="cart">
      <h1>Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <h2>Your Cart is Empty 😔</h2>
      ) : (
        <>
          {cart.map((food, index) => (
            <div className="cart-item" key={index}>
              <img
                src={food.image}
                alt={food.name}
                className="cart-image"
              />

              <div className="cart-info">
                <h2>{food.name}</h2>

                <p>{food.price}</p>

                <div className="quantity-box">
                  <button onClick={() => decreaseQuantity(food.id)}>
                    -
                  </button>

                  <span>{food.quantity}</span>

                  <button onClick={() => increaseQuantity(food.id)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(food.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: ₹{totalPrice}</h2>

            <Link to="/checkout" className="checkout-btn">
            Checkout 🛍️
          </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;