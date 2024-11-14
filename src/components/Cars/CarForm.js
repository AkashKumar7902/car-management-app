// src/components/Cars/CarForm.js
import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const CarForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      // Fetch existing car details
      const fetchCar = async () => {
        try {
          const response = await axios.get(`/api/cars/${id}`);
          const car = response.data;
          console.log(car);
          setForm({
            title: car.title,
            description: car.description,
            tags: car.tags?.join(", "),
            images: [],
          });
          if (car.images) setExistingImages(car.images);
        } catch (error) {
          console.error(error);
          alert("Failed to fetch car details");
        }
      };
      fetchCar();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert("You can upload up to 10 images.");
      return;
    }
    setForm({ ...form, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags, images } = form;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    if (isEdit) {
      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });
    }
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      if (isEdit) {
        await axios.put(`/api/cars/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate(`/cars/${id}`);
      } else {
        await axios.post("/api/cars", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/cars");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit form");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>{isEdit ? "Edit Car" : "Add New Car"}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={form?.tags}
        onChange={handleChange}
      />
      {isEdit && existingImages?.length > 0 && (
        <div>
          <h3>Existing Images</h3>
          {existingImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Existing ${index + 1}`}
              width="100"
            />
          ))}
        </div>
      )}
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <button type="submit">{isEdit ? "Update Car" : "Create Car"}</button>
    </form>
  );
};

export default CarForm;
