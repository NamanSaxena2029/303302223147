import { useState, useEffect } from "react";
import {
  Container, Typography, Button, Box, Card, CardContent,
  Chip, CircularProgress, Alert, TextField, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const AUTH_URL = "/api/evaluation-service/auth";
const NOTIF_URL = "/api/evaluation-service/notifications";

const AUTH_BODY = {
  email: "naman.saxena2023@ssipnt.com",
  name: "naman saxena",
  rollNo: "303302223147",
  accessCode: "aGBTJZ",
  clientID: "3c1aace1-eca0-4dab-b9fb-04dc1d5aa9fb",
  clientSecret: "MaJXHWTFDtmjdbNM",
};

const TYPE_COLORS = {
  Placement: { bg: "#e8f5e9", border: "#2e7d32", chip: "#2e7d32" },
  Result:    { bg: "#e3f2fd", border: "#1565c0", chip: "#1565c0" },
  Event:     { bg: "#f3e5f5", border: "#7b1fa2", chip: "#7b1fa2" },
};

async function getToken() {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(AUTH_BODY),
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchData(params = {}) {
  const token = await getToken();
  const query = new URLSearchParams();
  if (params.limit)             query.set("limit", String(params.limit));
  if (params.notification_type) query.set("notification_type", params.notification_type);
  const url = query.toString() ? `${NOTIF_URL}?${query.toString()}` : NOTIF_URL;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data
    : Array.isArray(data?.notifications) ? data.notifications
    : Array.isArray(data?.data) ? data.data
    : [];
}

export default function App() {
  const [page, setPage] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [filterType, setFilterType] = useState("");

  async function load(params = {}) {
    setLoading(true);
    setError("");
    try {
      const items = await fetchData(params);
      setNotifications(items);
    } catch (e) {
      setError(e.message || "Failed to load");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = search.trim()
    ? notifications.filter(n =>
        n.Message?.toLowerCase().includes(search.toLowerCase()) ||
        n.Type?.toLowerCase().includes(search.toLowerCase())
      )
    : notifications;

  const newCount = notifications.filter(n => !n.read_status).length;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <Box sx={{ bgcolor: "#1565c0", px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ color: "white", fontWeight: 700, fontSize: 18, flexGrow: 1 }}>
          Notifications
        </Typography>
        <Button size="small" onClick={() => { setPage("all"); load(); }}
          sx={{ color: "white", bgcolor: page==="all" ? "rgba(255,255,255,0.25)" : "transparent", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          All
          {newCount > 0 && (
            <Box component="span" sx={{ ml:0.5, bgcolor:"#ef5350", borderRadius:"50%", width:18, height:18, fontSize:11, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>
              {newCount}
            </Box>
          )}
        </Button>
        <Button size="small" onClick={() => setPage("priority")}
          sx={{ color: "white", bgcolor: page==="priority" ? "rgba(255,255,255,0.25)" : "transparent", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          Priority
        </Button>
      </Box>

      <Container maxWidth="sm" sx={{ py: 3 }}>

        {/* ALL NOTIFICATIONS */}
        {page === "all" && (
          <>
            <Typography variant="h6" fontWeight={700} mb={2}>All Notifications</Typography>
            <TextField fullWidth size="small" placeholder="Search..."
              value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment> }}
              sx={{ mb: 2, bgcolor: "white", borderRadius: 2 }}
            />
            {loading && <Box sx={{ textAlign:"center", py:4 }}><CircularProgress/></Box>}
            {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
            {!loading && filtered.filter(n => !n.read_status).length > 0 && (
              <Typography variant="overline" color="primary" fontWeight={700}>New</Typography>
            )}
            {!loading && filtered.filter(n => !n.read_status).map(n => <NotifCard key={n.ID||n.id} n={n}/>)}
            {!loading && filtered.filter(n => n.read_status).length > 0 && (
              <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mt:1, display:"block" }}>Earlier</Typography>
            )}
            {!loading && filtered.filter(n => n.read_status).map(n => <NotifCard key={n.ID||n.id} n={n}/>)}
            {!loading && filtered.length === 0 && !error && (
              <Typography color="text.secondary" textAlign="center" mt={4}>No notifications found</Typography>
            )}
          </>
        )}

        {/* PRIORITY NOTIFICATIONS */}
        {page === "priority" && (
          <>
            <Typography variant="h6" fontWeight={700} mb={2}>Priority Notifications</Typography>
            <Box sx={{ bgcolor:"white", borderRadius:2, p:2, mb:2, border:"1px solid #e0e0e0" }}>
              <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">FILTERS</Typography>
              <Box sx={{ display:"flex", gap:1, flexWrap:"wrap", mb:2 }}>
                {["", "Placement", "Result", "Event"].map(t => (
                  <Button key={t} size="small"
                    variant={filterType===t ? "contained" : "outlined"}
                    onClick={() => setFilterType(t)}
                    sx={{ borderRadius:2, textTransform:"none", fontSize:13 }}>
                    {t === "" ? "All Types" : t}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                <Typography variant="body2" color="text.secondary">Top N:</Typography>
                <TextField type="number" size="small" value={limit}
                  onChange={e => setLimit(Math.max(1, parseInt(e.target.value)||1))}
                  inputProps={{ min:1, max:50 }}
                  sx={{ width:80 }}
                />
                <Button variant="contained" size="small"
                  onClick={() => load({ limit, notification_type: filterType })}
                  sx={{ textTransform:"none", fontWeight:600 }}>
                  Apply
                </Button>
              </Box>
            </Box>
            {loading && <Box sx={{ textAlign:"center", py:4 }}><CircularProgress/></Box>}
            {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
            {!loading && notifications.map(n => <NotifCard key={n.ID||n.id} n={n}/>)}
            {!loading && notifications.length===0 && !error && (
              <Typography color="text.secondary" textAlign="center" mt={4}>Click Apply to load notifications</Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

function NotifCard({ n }) {
  const isNew = !n.read_status;
  const cfg = TYPE_COLORS[n.Type] || { bg:"#fff", border:"#ccc", chip:"#555" };
  return (
    <Card sx={{ mb:2, borderRadius:2, bgcolor: isNew ? cfg.bg : "#fff", border:`1.5px solid ${isNew ? cfg.border : "#e0e0e0"}`, boxShadow:"none" }}>
      <CardContent sx={{ p:"12px 16px !important" }}>
        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <Box flex={1}>
            <Box sx={{ display:"flex", gap:1, alignItems:"center", mb:0.5 }}>
              <Chip label={n.Type} size="small" sx={{ bgcolor:cfg.chip, color:"white", fontWeight:700, fontSize:"0.7rem", height:20 }}/>
              {isNew && <Chip label="NEW" size="small" sx={{ bgcolor:"#ef5350", color:"white", fontWeight:700, fontSize:"0.65rem", height:18 }}/>}
            </Box>
            <Typography sx={{ fontSize:"0.9rem", fontWeight: isNew?600:400, color: isNew?"#212121":"#757575" }}>
              {n.Message}
            </Typography>
            <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
              {n.Timestamp ? new Date(n.Timestamp).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : ""}
            </Typography>
          </Box>
          <Typography sx={{ fontSize:"0.75rem", fontWeight:600, color: isNew?cfg.chip:"#bdbdbd", ml:1, mt:0.3 }}>
            {isNew ? "New" : "Read"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}