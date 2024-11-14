// src/components/Cars/CarForm.js
import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper, Grid, Box, Chip } from '@mui/material';

const CarForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
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
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEdit ? "Edit Car" : "Add New Car"}
        </Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={form.tags}
                onChange={handleChange}
              />
            </Grid>
            {isEdit && existingImages?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Existing Images</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {existingImages.map((img, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img
                        src={img}
                        alt={`Existing ${index + 1}`}
                        width="100"
                        style={{ borderRadius: '4px' }}
                      />
                      {/* Optionally, add delete functionality for existing images */}
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Images
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                You can upload up to 10 images.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                {isEdit ? "Update Car" : "Create Car"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CarForm;
