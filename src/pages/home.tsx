import { RedirectToSignIn, SignedIn, UserButton } from "@neondatabase/neon-js/auth/react/ui";

// Example home page — not used in Clientum (App.tsx handles routing).
// Exported for completeness following the Neon Auth SDK docs.
export function Home() {
  return (
    <>
      <SignedIn>
        <div className="flex flex-col justify-center items-center min-h-screen gap-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">¡Bienvenido!</h1>
            <p className="text-zinc-400 mb-4">Autenticado correctamente.</p>
            <UserButton />
          </div>
        </div>
      </SignedIn>
      <RedirectToSignIn />
    </>
  );
}
