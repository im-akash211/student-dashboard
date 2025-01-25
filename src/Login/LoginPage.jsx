import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
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
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import { NavLink, useNavigate } from "react-router-dom";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address format. Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(""); // Clear any existing errors

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMessage(true);
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/dashboard"), 1000); // Redirect after a successful login
      })
      .catch((error) => {
        console.error("Firebase error: ", error);
        switch (error.code) {
          case "auth/user-not-found":
            setError("No user found with this email. Please register first.");
            break;
          case "auth/wrong-password":
            setError("Incorrect password. Please try again.");
            break;
          case "auth/invalid-email":
            setError("Invalid email format. Please check your email address.");
            break;
          case "auth/too-many-requests":
            setError(
              "Too many failed attempts. Please try again later or reset your password."
            );
            break;
          default:
            setError("Entered wrong email or password. Please try again.");
        }
      });
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((error) => {
      console.error("Google sign-in error: ", error);
      setError("Google sign-in failed. Please try again.");
    });
  };

  const signupWithGithub = () => {
    signInWithPopup(auth, githubProvider).catch((error) => {
      console.error("GitHub sign-in error: ", error);
      setError("GitHub sign-in failed. Please try again.");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: 5 }}>
      <Snackbar
        open={successMessage}
        autoHideDuration={1000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage(false)} severity="success">
          Login Successful!
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
          transition: "transform 0.3s ease, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2" }}
        >
          Sign In
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
          error={!!error}
          helperText={error}
          sx={{ marginBottom: 3 }}
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
                  sx={{
                    padding: 0,
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&:focus": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
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
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          Sign In
        </Button>

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          OR
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            onClick={signupWithGoogle}
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{
              borderRadius: 50,
              fontWeight: 600,
              textTransform: "none",
              padding: "10px 0",
              marginRight: 1,
            }}
          >
            Google
          </Button>

          <Button
            onClick={signupWithGithub}
            variant="outlined"
            startIcon={<GitHubIcon />}
            fullWidth
            sx={{
              borderRadius: 50,
              fontWeight: 600,
              textTransform: "none",
              padding: "10px 0",
              marginLeft: 1,
            }}
          >
            GitHub
          </Button>
        </Box>

        <Button
          variant="outlined"
          startIcon={<TwitterIcon />}
          fullWidth
          sx={{
            marginTop: 2,
            borderRadius: 50,
            fontWeight: 600,
            textTransform: "none",
            padding: "10px 0",
          }}
        >
          X (Twitter)
        </Button>

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Don’t have an account?{" "}
          <NavLink to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
            Register
          </NavLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
