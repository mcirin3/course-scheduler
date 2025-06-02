'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, User } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { savePlan, loadPlan } from "../lib/firestore";

import Layout from "../components/Layout";
import {
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ New: Course type defined for Firestore
type Course = {
  code: string;
  title: string;
  hours: string;
  description: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [plan, setPlan] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [planName, setPlanName] = useState("Fall 2025"); // ✅ New: Plan name state
  const planOptions = ["Fall 2025", "Spring 2026", "Backup Plan"]; // ✅ Options
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) return router.push("/login");
      setUser(u);

      try {
        const saved = await loadPlan(u.uid, planName); // ✅ Changed: use planName
        setPlan(saved);
      } catch (e) {
        console.error("Failed to load saved plan:", e);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // ✅ Load selected plan when planName changes
    if (user) {
      loadPlan(user.uid, planName)
        .then(setPlan)
        .catch((e) => console.error("Load failed", e));
    }
  }, [planName]);

  const handleLogout = () => signOut(auth);

  const handleSearch = async (subject: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/scrape?university=uic&subject=${subject}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setError(data?.error || "Unexpected error");
      }
    } catch (err) {
      setError("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = (newPlan: Course[]) => {
    setPlan(newPlan);
    if (user) {
      savePlan(user.uid, planName, newPlan).catch((e) =>
        console.error("Failed to save plan:", e)
      );
    }
  };

  const addToPlan = (course: Course) => {
    if (!plan.some((c) => c.code === course.code)) {
      updatePlan([...plan, course]);
    }
  };

  const removeFromPlan = (code: string) => {
    updatePlan(plan.filter((c) => c.code !== code));
  };

  const handleManualSave = () => {
    if (user) {
      savePlan(user.uid, planName, plan)
        .then(() => alert("Plan saved successfully!"))
        .catch((e) => console.error("Failed to save plan:", e));
    }
  };

  return (
    <Layout onSearch={handleSearch}>
      {/* ✅ Updated top bar with plan selector */}
      <Box className="flex justify-between items-center px-6 pt-4">
        <select
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {planOptions.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <div className="max-w-6xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Plan Card */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {user?.email}'s Course Plan ({planName})
            </Typography>
            {plan.length === 0 ? (
              <Typography>No courses added yet.</Typography>
            ) : (
              <List sx={{ maxHeight: 400, overflowY: "auto" }}>
                {plan.map((course) => (
                  <ListItem key={course.code}>
                    <ListItemText
                      primary={`${course.code}: ${course.title}`}
                      secondary={`${course.hours} hour(s) • ${course.description}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => removeFromPlan(course.code)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleManualSave}
              sx={{ mt: 2 }}
              fullWidth
            >
              Save Plan
            </Button>
          </CardContent>
        </Card>

        {/* Search Results Card */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Search Results
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && courses.length === 0 && !error && (
              <Typography>Try searching a subject like <strong>CS</strong>.</Typography>
            )}
            <List sx={{ maxHeight: 400, overflowY: "auto" }}>
              {courses.map((course) => (
                <ListItem key={course.code}>
                  <ListItemText
                    primary={`${course.code}: ${course.title}`}
                    secondary={`${course.hours} hour(s) • ${course.description}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => addToPlan(course)}>
                      <AddIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
