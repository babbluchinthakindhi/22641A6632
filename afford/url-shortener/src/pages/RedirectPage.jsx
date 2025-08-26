import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Card, CardContent, CardHeader, Typography, Button, Stack, CircularProgress,
} from "@mui/material";
import { getLink, isExpired, recordClick } from "../utils/storage";
import { logEvent } from "../utils/Logger";

export default function RedirectPage() {
  const { code } = useParams();
  const [status, setStatus] = useState("loading"); // loading | ok | expired | missing

  useEffect(() => {
    const link = getLink(code);
    if (!link) {
      logEvent("redirect_missing", { code });
      setStatus("missing");
      return;
    }
    if (isExpired(link)) {
      logEvent("redirect_expired", { code });
      setStatus("expired");
      return;
    }

    // Record click (timestamp, referrer, timezone).
    recordClick(code, { referrer: document.referrer });

    // small delay so the write lands before navigation
    setTimeout(() => {
      try {
        window.location.href = link.longUrl;
      } catch (e) {
        logEvent("error", { where: "RedirectPage.navigate", message: String(e) });
      }
    }, 150);

    setStatus("ok");
  }, [code]);

  if (status === "loading" || status === "ok") {
    return (
      <Stack alignItems="center" spacing={2} sx={{ mt: 6 }}>
        <CircularProgress />
        <Typography>Redirecting…</Typography>
      </Stack>
    );
  }

  return (
    <Card sx={{ maxWidth: 640, mx: "auto" }}>
      <CardHeader title={status === "missing" ? "Invalid short URL" : "This short link has expired"} />
      <CardContent>
        <Typography sx={{ mb: 2 }}>
          {status === "missing"
            ? "We couldn't find a URL mapped to this shortcode."
            : "The validity period for this link has ended."}
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">Create a new short link</Button>
      </CardContent>
    </Card>
  );
}
