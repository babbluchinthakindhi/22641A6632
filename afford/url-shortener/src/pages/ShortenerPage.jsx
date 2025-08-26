import React, { useState } from "react";
import { Stack, Alert } from "@mui/material";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";
import { createShortLinks } from "../utils/storage";
import { logEvent } from "../utils/Logger";

export default function ShortenerPage() {
  const [lastCreated, setLastCreated] = useState([]);
  const [info, setInfo] = useState("");

  const handleCreate = (payload) => {
    try {
      const created = createShortLinks(payload);
      setLastCreated(created);
      setInfo(`${created.length} short link(s) created successfully.`);
    } catch (e) {
      logEvent("error", {
        where: "ShortenerPage.handleCreate",
        message: e?.message,
      });
      alert("Something went wrong while creating links.");
    }
  };

  return (
    <Stack spacing={3}>
      {info && <Alert severity="success">{info}</Alert>}
      <UrlForm onCreate={handleCreate} />
      <UrlList items={lastCreated} />
    </Stack>
  );
}
