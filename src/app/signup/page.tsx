'use client';

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader
          title="Create an Account"
          subheader="Get started with Course Scheduler"
          titleTypographyProps={{ variant: "h5", align: "center" }}
          subheaderTypographyProps={{ align: "center" }}
        />
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button variant="contained" onClick={handleSignup} fullWidth>
              Sign Up
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
