import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase.js";
import {
  Button,
  Box,
  Typography,
  Container,
  InputAdornment,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { NavLink, useNavigate } from "react-router-dom";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear any existing errors

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMessage(true);
        setTimeout(() => {
          navigate("/login"); // Redirect to login after success
        }, 3000); // Delay to show success message
      })
      .catch((error) => {
        console.error("Firebase error: ", error);
        setError(error.message || "An unexpected error occurred.");
      });
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate("/dashboard"); // Redirect to dashboard or home after successful sign-in
      })
      .catch((error) => {
        console.error("Google sign-in error: ", error);
        setError("Google sign-in failed. Please try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: 5 }}>
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage(false)} severity="success">
          Registration Successful! Redirecting to login...
        </Alert>
      </Snackbar>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 4,
          borderRadius: 2,
          boxShadow: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2" }}
        >
          Register
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(""); // Clear error on typing
          }}
          sx={{ marginBottom: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(""); // Clear error on typing
          }}
          sx={{ marginBottom: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError(""); // Clear error on typing
          }}
          error={!!error}
          helperText={error}
          sx={{ marginBottom: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            padding: "14px 0",
            fontWeight: 600,
            borderRadius: 50,
            textTransform: "none",
          }}
        >
          Register
        </Button>

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          OR
        </Typography>

        <Button
          onClick={signupWithGoogle}
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{
            marginTop: 2,
            padding: "10px 0",
            borderRadius: 50,
            fontWeight: 600,
          }}
        >
          Sign in with Google
        </Button>

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Already have an account?{" "}
          <NavLink to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Login
          </NavLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
