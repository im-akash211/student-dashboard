import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
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
import TwitterIcon from "@mui/icons-material/Twitter"; // Using Twitter as X logo
import { NavLink } from "react-router-dom";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const createUser = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError(""); // Clear any existing errors
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMessage(true);
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider);
  };

  const signupWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
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
          SignUp Successful!
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
        <NavLink to="/home">
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
        </NavLink>

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
      </Box>
    </Container>
  );
};

export default LoginView;
