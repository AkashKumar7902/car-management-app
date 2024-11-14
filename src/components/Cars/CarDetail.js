// src/components/Cars/CarDetail.js
import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { useParams, useNavigate, Link } from "react-router-dom";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`/api/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch car details");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`/api/cars/${id}`);
        navigate("/cars");
      } catch (error) {
        console.error(error);
        alert("Failed to delete car");
      }
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id]);

  if (!car) return <div>Loading...</div>;

  return (
    <div>
      <h2>{car.title}</h2>
      <p>{car.description}</p>
      <p>Tags: {car.tags?.join(", ")}</p>
      <div>
        <h3>Images</h3>
        {car.images && car.images.length > 0 ? (
          car.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${car.title} ${index + 1}`}
              width="200"
            />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>
      <Link to={`/cars/${id}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default CarDetail;
