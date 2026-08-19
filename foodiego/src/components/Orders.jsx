import "../css/Orders.css";

function Orders() {
  const orders =
    JSON.parse(localStorage.getItem("foodieGoOrders")) || [];

  return (
    <section className="orders-page">
      <h1>My Orders 📦</h1>

      {orders.length === 0 ? (
        <h2>No orders yet 😔</h2>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h2>Order #{order.id}</h2>

              <p>
                <strong>Date:</strong> {order.date}
              </p>

              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <div className="order-items">
                {order.items.map((food) => (
                  <p key={food.id}>
                    {food.name} × {food.quantity}
                  </p>
                ))}
              </div>

              <h3>Total: ₹{order.total}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;