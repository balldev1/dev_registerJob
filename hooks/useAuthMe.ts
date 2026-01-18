// hooks/useAuthMe.ts
"use client";

import { useEffect, useState } from "react";

export function useAuthMe() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUnauthorized(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading, unauthorized };
}
