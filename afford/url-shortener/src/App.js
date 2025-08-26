import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Container, Box, Button,
} from "@mui/material";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";
import RedirectPage from "./pages/RedirectPage";

function Nav() {
  const loc = useLocation();
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          React URL Shortener
        </Typography>
        <Button
          component={Link}
          to="/"
          variant={loc.pathname === "/" ? "contained" : "text"}
          sx={{ mr: 1 }}
        >
          Shorten URLs
        </Button>
        <Button
          component={Link}
          to="/stats"
          variant={loc.pathname.startsWith("/stats") ? "contained" : "text"}
        >
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <Nav />
      <Container sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/r/:code" element={<RedirectPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
