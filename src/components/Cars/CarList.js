// src/components/Cars/CarList.js
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { Link as RouterLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchCars = async () => {
        try {
            const response = await axios.get('/api/cars');
            setCars(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const searchCars = async (keyword) => {
        try {
            const response = await axios.get(`/api/cars/search?keyword=${keyword}`);
            setCars(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        if (keyword.trim() === '') {
            fetchCars();
        } else {
            searchCars(keyword);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4, marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">My Cars</Typography>
                <Button variant="contained" color="primary" component={RouterLink} to="/cars/new">
                    Add New Car
                </Button>
            </Box>
            <SearchBar onSearch={handleSearch} />
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
                {cars.map((car) => (
                    <Grid item xs={12} sm={6} md={4} key={car.ID}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {car.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {car.description.substring(0, 100)}...
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={RouterLink} to={`/cars/${car.ID}`}>
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                {cars.length === 0 && (
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        No cars found.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default CarList;
