// src/components/Cars/CarList.js
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

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

    console.log(cars)

    return (
        <div>
            <h2>My Cars</h2>
            <SearchBar onSearch={handleSearch} />
            <Link to="/cars/new">Add New Car</Link>
            <ul>
                {cars.map((car) => (
                    <li key={car.ID}>
                        <Link to={`/cars/${car.ID}`}>{car.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CarList;
