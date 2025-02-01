import React, { useState } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./App.css";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("driving");
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRoute(null);
    setLoading(true);
    setMessage("Fetching you the best route...");

    try {
      const response = await axios.post(
        "https://routeme.azurewebsites.net/maps/route",
        {
          source,
          destination,
          mode,
        }
      );

      setTimeout(() => setMessage("Here we go!"), 1000);
      setTimeout(() => setMessage("Bon voyage!"), 2000);

      setTimeout(() => {
        setRoute(response.data);
        setLoading(false);
        setMessage(""); // Reset message when done
      }, 3000);
    } catch (error) {
      setError("Error fetching route. Please try again.");
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1 className="header">Map Route Optimizer</h1>
      <form onSubmit={handleSubmit} className="route-form">
        <div className="form-group">
          <label>Source:</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="form-input"
          >
            <option value="driving">Driving</option>
            <option value="walking">Walking</option>
            <option value="bicycling">Bicycling</option>
          </select>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span className="loader"></span> : "Get Route"}
        </button>
      </form>

      {loading && (
        <div className="loading-container">
          <DotLottieReact
            src="https://lottie.host/af04c7fe-533a-48f4-8367-a0fd110ceaf7/EA8rP65Tna.lottie"
            loop
            autoplay
            className="lottie-animation"
          />
          <p className="loading-text">{message}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {route && (
        <div className="route-details">
          <h2 className="route-heading">Route Details</h2>
          <div className="route-summary">
            <p>
              <strong>Total Distance:</strong> {route.totalDistance} meters
            </p>
            <p>
              <strong>ETA:</strong> {route.eta}
            </p>
          </div>

          <div className="route-steps">
            {route.steps.map((step, index) => (
              <div key={index} className="route-step">
                <div className="step-toggle">
                  <span>{step.instructions}</span>
                  <span>
                    {step.readable_distance} - ETA: {step.readable_duration}
                  </span>
                </div>
                <div className="step-details">{step.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
