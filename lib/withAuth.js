// lib/withAuth.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      async function checkAuth() {
        try {
          const res = await fetch("/api/profile", {
            credentials: "include",
          });

          if (!res.ok) {
            setTimeout(() => {
              router.push("/connexion");
            }, 3000);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          router.push("/index");
        }
      }

      checkAuth();
    }, []);

    if (isLoading) return <div>Chargement...</div>;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
