'use client';

import { useEffect, useState } from "react";
import { auth, User } from "../lib/firebase";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import { signOut } from "firebase/auth";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) router.push("/login");
      setUser(u);
    });
    return () => unsub();
  }, []);

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

  const addToPlan = (course: Course) => {
    if (!plan.some((c) => c.code === course.code)) {
      setPlan((prev) => [...prev, course]);
    }
  };

  const removeFromPlan = (code: string) => {
    setPlan((prev) => prev.filter((c) => c.code !== code));
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Planned Courses */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {user?.email}'s Course Plan
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
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ mt: 2 }}
              fullWidth
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
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
