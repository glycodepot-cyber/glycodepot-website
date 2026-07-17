import { redirect } from "next/navigation";

// Clerk handles password reset inside its embedded <SignIn> component.
export default function ForgotPasswordPage() {
  redirect("/my-account");
}
