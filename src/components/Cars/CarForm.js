// src/components/Cars/CarForm.js
import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

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
  const [selectedFiles, setSelectedFiles] = useState([]);

  // State to track images marked for deletion
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

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
    if (files.length + selectedFiles.length + existingImages.length > 10) {
      alert("You can upload up to 10 images.");
      return;
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Function to open the delete confirmation dialog
  const handleOpenDeleteDialog = (img) => {
    setImageToDelete(img);
    setOpenDeleteDialog(true);
  };

  // Function to close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setImageToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Function to confirm deletion of an image
  const handleConfirmDeleteImage = () => {
    if (imageToDelete) {
      setImagesToDelete((prev) => [...prev, imageToDelete]);
      setExistingImages((prev) => prev.filter((img) => img !== imageToDelete));
      handleCloseDeleteDialog();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags } = form;
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    if (isEdit) {
      // Append remaining existing images to keep
      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });

      // Append images marked for deletion
      imagesToDelete.forEach((img) => {
        formData.append("imagesToDelete", img);
      });
    }

    // Append new images to upload
    selectedFiles.forEach((image) => {
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
            {/* Title Field */}
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
            {/* Description Field */}
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
            {/* Tags Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={form.tags}
                onChange={handleChange}
              />
            </Grid>
            {/* Existing Images (Edit Mode) */}
            {isEdit && existingImages?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Existing Images
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {existingImages.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Existing ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                        onClick={() => handleOpenDeleteDialog(img)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
            {/* Image Upload */}
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
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 1 }}
              >
                You can upload up to 10 images.
              </Typography>
            </Grid>
            {/* Display Selected File Names */}
            {selectedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected Images:
                </Typography>
                <List>
                  {selectedFiles.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          width="50"
                          height="50"
                          style={{ borderRadius: "4px", marginRight: "10px" }}
                        />
                        <ListItemText primary={file.name} />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                {isEdit ? "Update Car" : "Create Car"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Image</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDeleteImage} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default CarForm;
