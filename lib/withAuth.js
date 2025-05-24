// lib/withAuth.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch("/api/profile", {
            method: "GET",
            credentials: "include",
          });

          if (res.ok) {
            setIsLoading(false);
          } else {
            router.push("/connexion");
          }
        } catch (error) {
          router.push("/connexion");
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) return <div>Chargement...</div>;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
