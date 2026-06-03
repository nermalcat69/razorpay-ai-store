import LoginForm from "./LoginForm";

export default function LoginPage() {
  const passwordHint = process.env.ADMIN_PASSWORD ?? "(not set)";
  return <LoginForm passwordHint={passwordHint} />;
}
