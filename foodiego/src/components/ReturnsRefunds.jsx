import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/ReturnsRefunds.css";

function ReturnsRefunds() {
  const { returnRequests, submitReturnRequest, showToast } = useContext(CartContext);

  const [orderId, setOrderId] = useState("FGO-8921");
  const [selectedItem, setSelectedItem] = useState("Margherita Pizza");
  const [returnReason, setReturnReason] = useState("Item received cold / lukewarm");
  const [pickupDate, setPickupDate] = useState("Tomorrow (10:00 AM - 01:00 PM)");
  const [refundMethod, setRefundMethod] = useState("FoodieGo Wallet (Instant)");
  const [photoProof, setPhotoProof] = useState(null);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const reasonsList = [
    "Item received cold / lukewarm",
    "Incorrect dish delivered by restaurant",
    "Damaged packaging / spillage during transit",
    "Missing toppings or items in the order",
    "Excessive delivery delay (> 45 mins)",
    "Quality or freshness issue"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = submitReturnRequest({
      orderId,
      itemName: selectedItem,
      reason: returnReason,
      pickupDate,
      refundMethod,
      refundAmount: 299
    });
    setSubmittedRequest(req);
  };

  return (
    <div className="returns-page-container">
      {/* Header */}
      <div className="returns-header">
        <span className="returns-badge">100% BUYER SATISFACTION</span>
        <h1>Returns, Replacements & Refunds 🔄</h1>
        <p>Hassle-free 1-click return requests with instant FoodieGo wallet refunds</p>
      </div>

      <div className="returns-grid-layout">
        {/* Left Form: Initiate Request */}
        <div className="return-form-card">
          {submittedRequest ? (
            <div className="return-success-view">
              <div className="success-icon">🎉</div>
              <h3>Return Request #{submittedRequest.id} Confirmed!</h3>
              <p>
                Our courier executive will arrive on <strong>{submittedRequest.pickupDate}</strong>.
                Your refund of <strong>₹{submittedRequest.refundAmount}</strong> will be credited to your{" "}
                <strong>{submittedRequest.refundMethod}</strong> upon pickup scan.
              </p>
              <button className="new-req-btn" onClick={() => setSubmittedRequest(null)}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>Create Return / Replacement Request</h3>

              <div className="form-group">
                <label>Select Order ID *</label>
                <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                  <option value="FGO-8921">Order #FGO-8921 (Recent Order - ₹598)</option>
                  <option value="FGO-7612">Order #FGO-7612 (2 Days ago - ₹428)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Select Item to Return *</label>
                <input
                  type="text"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  placeholder="e.g. Margherita Pizza"
                  required
                />
              </div>

              <div className="form-group">
                <label>Reason for Return / Replacement *</label>
                <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)}>
                  {reasonsList.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Upload Photo / Proof (Optional)</label>
                <div className="upload-photo-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setPhotoProof(e.target.files[0].name);
                        showToast(`Attached photo: ${e.target.files[0].name}`, "info");
                      }
                    }}
                  />
                  <span>📸 {photoProof ? `Attached: ${photoProof}` : "Click or Drag Photo of Item / Receipt"}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Pickup Slot *</label>
                <select value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}>
                  <option value="Today (04:00 PM - 07:00 PM)">Today (04:00 PM - 07:00 PM)</option>
                  <option value="Tomorrow (10:00 AM - 01:00 PM)">Tomorrow (10:00 AM - 01:00 PM)</option>
                  <option value="Tomorrow (02:00 PM - 05:00 PM)">Tomorrow (02:00 PM - 05:00 PM)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Refund Settlement Method *</label>
                <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
                  <option value="FoodieGo Wallet (Instant Credit)">⚡ FoodieGo Wallet (Instant Credit)</option>
                  <option value="Original Payment Method (1-2 business days)">💳 Original Payment Card / UPI (1-2 days)</option>
                  <option value="Direct Bank Transfer via UPI">🏦 Direct Bank Transfer via UPI</option>
                </select>
              </div>

              <button type="submit" className="submit-return-btn">
                Submit Return Request →
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Existing Return Tickets & Policy Timeline */}
        <div className="returns-status-column">
          <div className="return-policy-timeline-card">
            <h3>🔄 Refund & Pickup Process</h3>
            <div className="timeline-steps">
              <div className="t-step">
                <div className="t-num">1</div>
                <div>
                  <strong>Request Submitted</strong>
                  <p>Verified instantly by our 24/7 quality assurance team.</p>
                </div>
              </div>
              <div className="t-step">
                <div className="t-num">2</div>
                <div>
                  <strong>Courier Pickup</strong>
                  <p>Our rider collects the parcel at your selected slot.</p>
                </div>
              </div>
              <div className="t-step">
                <div className="t-num">3</div>
                <div>
                  <strong>Instant Refund</strong>
                  <p>100% money credited to your FoodieGo Wallet or Bank.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="existing-returns-card">
            <h3>Recent Return Tickets ({returnRequests.length})</h3>
            <div className="tickets-list">
              {returnRequests.map((req) => (
                <div className="ticket-item" key={req.id}>
                  <div className="ticket-top">
                    <strong>#{req.id}</strong>
                    <span className="ticket-status">{req.status}</span>
                  </div>
                  <p>{req.itemName} • {req.reason}</p>
                  <small>Pickup: {req.pickupDate}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnsRefunds;
