"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function Login() {
  const { signIn } = useAuthActions();

  const handleLogin = () => {};

  return (
    <button onClick={() => void signIn("google")}>Sign in with Google</button>
  );
}
