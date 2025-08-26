import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Box,
  Typography,
  Chip,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { listLinksArray, isExpired } from "../utils/storage";
import { getLogs, clearLogs } from "../utils/Logger";

function ClickLogTable({ rows }) {
  if (!rows?.length)
    return (
      <Typography sx={{ p: 2 }} color="text.secondary">
        No clicks yet.
      </Typography>
    );
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Timestamp</TableCell>
          <TableCell>Referrer</TableCell>
          <TableCell>Location (Timezone)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i}>
            <TableCell>{new Date(r.ts).toLocaleString()}</TableCell>
            <TableCell
              sx={{
                maxWidth: 320,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {r.referrer || "—"}
            </TableCell>
            <TableCell>{r.tz || "unknown"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function StatsPage() {
  const [open, setOpen] = useState({});
  const data = useMemo(() => listLinksArray(), []);
  const logs = useMemo(() => getLogs(), []);

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          title="Short Links – Statistics"
          subheader="Creation/expiry, total clicks, and detailed click logs."
          action={
            <Tooltip title="Clear internal logs (for debugging only)">
              <IconButton
                onClick={() => {
                  clearLogs();
                  window.location.reload();
                }}
              >
                <DeleteSweepIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell align="right">Clicks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((link) => (
                <React.Fragment key={link.code}>
                  <TableRow hover>
                    <TableCell width={48}>
                      <IconButton
                        onClick={() =>
                          setOpen((o) => ({ ...o, [link.code]: !o[link.code] }))
                        }
                      >
                        {open[link.code] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <a href={link.shortUrl} target="_blank" rel="noreferrer">
                        {link.shortUrl}
                      </a>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 360,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <a href={link.longUrl} target="_blank" rel="noreferrer">
                        {link.longUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(link.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={new Date(link.expiresAt).toLocaleString()}
                        color={isExpired(link) ? "error" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <b>{link.clicks}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={!!open[link.code]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ m: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Click Details
                          </Typography>
                          <ClickLogTable rows={link.clickLogs} />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Internal App Logs (for the mandatory logging requirement)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Showing the last {logs.length} events captured by the logging
              middleware.
            </Typography>
            <pre
              style={{
                background: "#f6f6f6",
                padding: 12,
                borderRadius: 8,
                maxHeight: 240,
                overflow: "auto",
              }}
            >
              {JSON.stringify(logs, null, 2)}
            </pre>
            <Button onClick={() => window.location.reload()} variant="outlined">
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
