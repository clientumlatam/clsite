// Auth page — uses our custom NeonAuthGate which proxies to Neon Auth
// (the @neondatabase/neon-js SDK is blocked by the Replit firewall; our
// backend proxy achieves the same identity-provider integration via REST)
import NeonAuthGate from "../components/NeonAuthGate";

interface AuthPageProps {
  onAuthenticated: (username: string, role?: string) => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  return <NeonAuthGate onAuthenticated={onAuthenticated} />;
}
