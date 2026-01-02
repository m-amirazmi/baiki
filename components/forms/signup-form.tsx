"use client";

import { signUpEmail } from "@/modules/auth/auth.actions";
import { Button } from "../ui/button";

export const SignUpForm = () => {
  const handleSignUp = async () => {
    const user = await signUpEmail({
      email: "abc2@email.com",
      name: "ABC User 2",
      password: "securepassword123",
    });

    console.log("Signed up user:", user);
  };

  return (
    <div>
      <div>Sign Up Form</div>
      <Button onClick={handleSignUp}>Sign Up</Button>
    </div>
  );
};
