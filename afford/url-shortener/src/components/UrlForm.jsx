import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, TextField, Grid, Button, Alert, Stack, Typography,
} from "@mui/material";
import { isValidHttpUrl, isValidMinutes, isValidShortcode } from "../utils/validators";

const emptyRow = () => ({ longUrl: "", minutes: "", shortcode: "" });

export default function UrlForm({ onCreate }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState("");

  const addRow = () => {
    if (rows.length >= 5) return setError("You can shorten up to 5 URLs at once.");
    setRows((r) => [...r, emptyRow()]);
  };

  const removeRow = (idx) => {
    setRows((r) => r.filter((_, i) => i !== idx));
  };

  const update = (idx, field, val) => {
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [field]: val } : row)));
  };

  const validateAll = () => {
    for (const r of rows) {
      if (!isValidHttpUrl(r.longUrl)) return "Please enter a valid http(s) URL.";
      if (!isValidMinutes(r.minutes)) return "Validity must be a positive integer (minutes).";
      if (!isValidShortcode(r.shortcode)) {
        return "Shortcode may contain a-z, A-Z, 0-9, _ or -, length 3–20.";
      }
    }
    return "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const msg = validateAll();
    if (msg) return setError(msg);
    setError("");
    const payload = rows
      .filter((r) => r.longUrl.trim())
      .map((r) => ({ ...r, minutes: r.minutes ? parseInt(r.minutes, 10) : undefined }));
    onCreate(payload);
  };

  return (
    <Card>
      <CardHeader
        title="Create Short Links"
        subheader="Provide long URL, optional validity (minutes), and optional preferred shortcode."
      />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {rows.map((row, idx) => (
              <Card key={idx} variant="outlined">
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Original Long URL"
                        fullWidth
                        required
                        value={row.longUrl}
                        onChange={(e) => update(idx, "longUrl", e.target.value)}
                        placeholder="https://example.com/very/long/path"
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        label="Validity (min)"
                        fullWidth
                        value={row.minutes}
                        onChange={(e) => update(idx, "minutes", e.target.value.replace(/\D/g, ""))}
                        placeholder="30"
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        label="Preferred Shortcode"
                        fullWidth
                        value={row.shortcode}
                        onChange={(e) => update(idx, "shortcode", e.target.value)}
                        placeholder="my-link"
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Button
                        onClick={() => removeRow(idx)}
                        color="error"
                        variant="outlined"
                        disabled={rows.length === 1}
                        fullWidth
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            <Stack direction="row" spacing={1}>
              <Button onClick={addRow} variant="outlined">Add another</Button>
              <Button type="submit" variant="contained">Shorten</Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              If validity is not provided, it defaults to <b>30 minutes</b>. Shortcodes must be unique; if
              your preferred code is taken, the app will generate one automatically.
            </Typography>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
