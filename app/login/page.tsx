import LoginClient from "./LoginClient";
import { getSupabaseEnv } from "../../lib/env";

export default function LoginPage() {
  const { url, key } = getSupabaseEnv();

  return (
    <LoginClient
      supabaseUrl={url}
      supabaseAnonKey={key}
    />
  );
}
