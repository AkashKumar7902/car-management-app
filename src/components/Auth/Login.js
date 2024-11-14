// src/components/Auth/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper, Grid } from '@mui/material';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                  />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                  />
              </Grid>
              <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                      Login
                  </Button>
              </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
