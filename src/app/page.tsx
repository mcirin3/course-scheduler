'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./lib/firebase";
import { Button, Typography, Container, Box } from "@mui/material";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/home");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 12 }}>
      <Box textAlign="center" p={4} boxShadow={3} borderRadius={3}>
        <Typography variant="h3" gutterBottom>
          🎓 Course Scheduler
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Plan your perfect university class schedule with ease.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
          Sign up to start browsing available courses, create your personal schedule,
          and avoid time conflicts.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Link href="/signup">
            <Button variant="contained" size="large">Sign Up</Button>
          </Link>
          <Link href="/login">
            <Button variant="outlined" size="large">Log In</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
