import { SignUpForm } from "@/components/forms/signup-form";

export default async function AuthSignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-accent">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
