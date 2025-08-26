import React from "react";
import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { isExpired } from "../utils/storage";

export default function UrlList({ items }) {
  if (!items?.length) return null;

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert(text);
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Shortened URLs" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.code} hover>
                <TableCell>
                  <a href={row.shortUrl} target="_blank" rel="noreferrer">{row.shortUrl}</a>
                </TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <a href={row.longUrl} target="_blank" rel="noreferrer">{row.longUrl}</a>
                </TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={new Date(row.expiresAt).toLocaleString()}
                    color={isExpired(row) ? "error" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Copy">
                    <IconButton onClick={() => copy(row.shortUrl)}><ContentCopyIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Open">
                    <IconButton href={row.shortUrl} target="_blank" rel="noreferrer">
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
