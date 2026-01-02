"use client";

import { signInEmail } from "@/modules/auth/auth.actions";
import { Button } from "../ui/button";

export const SignInForm = () => {
  const handleSignIn = async () => {
    const user = await signInEmail({
      email: "abc@email.com",
      password: "securepassword123",
    });

    console.log("Signed in user:", user);
  };

  return (
    <div>
      <div>Sign In Form</div>
      <Button onClick={handleSignIn}>Sign In</Button>
    </div>
  );
};
