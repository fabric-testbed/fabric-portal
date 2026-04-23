import { redirect } from "next/navigation";

export default async function SignupLegacy({ params }) {
  const { signupStepId } = await params;
  redirect(`/signup/${signupStepId}`);
}

