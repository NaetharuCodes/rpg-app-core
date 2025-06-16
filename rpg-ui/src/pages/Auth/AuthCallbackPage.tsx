// rpg-ui/src/pages/AuthCallbackPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const hasNavigated = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        const isValid = await verifyToken(token);
        if (isValid) {
          setStatus("success");
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            setTimeout(() => navigate("/"), 2000);
          }
        } else {
          setStatus("error");
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            setTimeout(() => navigate("/"), 3000);
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, verifyToken, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Signing you in...</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">
              Successfully signed in!
            </h2>
            <p className="text-muted-foreground">
              Redirecting you to the app...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Sign in failed
            </h2>
            <p className="text-muted-foreground">
              There was a problem signing you in. Redirecting to home...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
