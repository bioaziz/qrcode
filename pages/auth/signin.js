import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const { error } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[linear-gradient(135deg,#f8fafc,#eef2ff)] dark:bg-[linear-gradient(135deg,#0b0b0b,#111827)]">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Choose a provider to continue</CardDescription>
            {error ? (
              <p className="text-sm text-red-600 mt-2">{String(error)}</p>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            <ProviderButton
              brand="Google"
              color="outline"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              Icon={IconGoogle}
            />
            <ProviderButton
              brand="Facebook"
              color="outline"
              className="border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/5"
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
              Icon={IconFacebook}
            />
            {/*<ProviderButton*/}
            {/*  brand="Instagram"*/}
            {/*  color="outline"*/}
            {/*  className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F]/5"*/}
            {/*  onClick={() => signIn("instagram", { callbackUrl: "/" })}*/}
            {/*  Icon={IconInstagram}*/}
            {/*/>*/}
            <div className="text-center pt-2">
              <Button variant="ghost" onClick={() => router.push("/")}>Back to home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProviderButton({ brand, onClick, Icon, color = "outline", className }) {
  return (
    <Button onClick={onClick} variant={color} className={`w-full justify-between ${className || ""}`}>
      <span className="shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <span className="flex-1 text-center">Continue with {brand}</span>
      <span className="w-5" />
    </Button>
  );
}

function IconGoogle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.84h5.39c-.24 1.23-1.3 3.6-5.39 3.6-3.24 0-5.88-2.67-5.88-5.94S8.76 5.76 12 5.76c1.85 0 3.1.78 3.81 1.44l2.6-2.5C17.04 3.18 14.76 2.28 12 2.28 6.96 2.28 2.88 6.36 2.88 11.4S6.96 20.52 12 20.52c6.96 0 8.04-4.86 8.04-7.02 0-.48-.06-.78-.12-1.14H12z" />
      <path fill="#34A853" d="M3.96 7.38l3.2 2.34C8.04 7.59 9.84 6.48 12 6.48c1.85 0 3.1.78 3.81 1.44l2.6-2.5C17.04 3.18 14.76 2.28 12 2.28 8.28 2.28 5.16 4.35 3.96 7.38z" opacity=".0" />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path d="M13.5 12.5h2.2l.3-2.3h-2.5V8.8c0-.66.22-1.25 1.24-1.25H16V5.6c-.22-.03-.98-.1-1.87-.1-1.85 0-3.11 1.13-3.11 3.2v1.6H9v2.3h2.02V19h2.48v-6.5z" fill="#fff" />
    </svg>
  );
}


// function IconInstagram(props) {
//   return (
//     <svg viewBox="0 0 24 24" {...props}>
//       <rect x="3" y="3" width="18" height="18" rx="5" fill="#E4405F" />
//       <circle cx="12" cy="12" r="4.5" fill="#fff" />
//       <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
//     </svg>
//   );
// }

// If already authenticated, redirect away from the sign-in page server-side
export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("../api/auth/[...nextauth]");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
