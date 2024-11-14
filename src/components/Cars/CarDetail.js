// src/components/Cars/CarDetail.js
import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Grid, Button, Card, CardMedia, CardContent, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

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
    try {
      await axios.delete(`/api/cars/${id}`);
      navigate("/cars");
    } catch (error) {
      console.error(error);
      alert("Failed to delete car");
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id]);

  if (!car) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        {car.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {car.description}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Tags: {car.tags?.join(", ")}
      </Typography>
      <Box sx={{ marginY: 2 }}>
        <Typography variant="h6">Images</Typography>
        <Grid container spacing={2}>
          {car.images && car.images.length > 0 ? (
            car.images.map((img, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={img}
                    alt={`${car.title} ${index + 1}`}
                  />
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body2">No images available.</Typography>
          )}
        </Grid>
      </Box>
      <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" component={RouterLink} to={`/cars/${id}/edit`}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>
          Delete
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this car? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CarDetail;
