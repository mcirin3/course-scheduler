'use client';

import { useEffect, useState } from 'react';
import { auth, User } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import {
  getCompletedCourses,
  loadPlan,
  saveCompletedCourses,
} from '../lib/firestore';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Alert,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Layout from '../components/Layout';

type Course = {
  code: string;
  title: string;
  hours: string;
  description: string;
};

export default function CompletedCoursesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [completed, setCompleted] = useState<Course[]>([]);
  const [planCourses, setPlanCourses] = useState<Course[]>([]);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) return router.push('/login');
      setUser(u);

      try {
        const completed = await getCompletedCourses(u.uid);
        const allPlans = await Promise.all([
          loadPlan(u.uid, 'Fall 2025'),
          loadPlan(u.uid, 'Spring 2026'),
          loadPlan(u.uid, 'Backup Plan'),
        ]);
        setCompleted(completed);
        setPlanCourses(allPlans.flat());
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    });

    return () => unsub();
  }, []);

  const isInPlan = (code: string) => planCourses.some((c) => c.code === code);
  const isAlreadyCompleted = (code: string) => completed.some((c) => c.code === code);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/scrape?university=uic&subject=${searchQuery}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (course: Course) => {
    if (!user || isAlreadyCompleted(course.code)) return;

    const updated = [...completed, course];
    setCompleted(updated);
    try {
      await saveCompletedCourses(user.uid, updated);
    } catch (e) {
      console.error('Failed to save completed courses:', e);
    }
  };

  return (
    <Layout>
      <Card className="max-w-3xl mx-auto mt-8">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Completed Courses
          </Typography>
          {completed.length === 0 ? (
            <Typography>You haven't added any completed courses yet.</Typography>
          ) : (
            <List>
              {completed.map((course) => (
                <ListItem key={course.code}>
                  <ListItemText
                    primary={`${course.code}: ${course.title}`}
                    secondary={`${course.hours} hour(s) • ${course.description}`}
                  />
                  {isInPlan(course.code) && (
                    <Alert severity="warning" sx={{ ml: 2 }}>
                      Already in a plan!
                    </Alert>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Completed Courses Section */}
      <Card className="max-w-3xl mx-auto mt-6">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Completed Courses
          </Typography>
          <Box className="flex gap-2 mb-4">
            <TextField
              label="Search Subject (e.g., CS)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {searchResults.map((course) => (
                <ListItem key={course.code}>
                  <ListItemText
                    primary={`${course.code}: ${course.title}`}
                    secondary={`${course.hours} hour(s) • ${course.description}`}
                  />
                  <IconButton
                    edge="end"
                    onClick={() => handleMarkCompleted(course)}
                    disabled={isAlreadyCompleted(course.code)}
                    title={isAlreadyCompleted(course.code) ? 'Already completed' : 'Mark as completed'}
                  >
                    <CheckIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
