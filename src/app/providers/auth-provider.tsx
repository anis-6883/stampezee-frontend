"use client";

import { useGetOwnProfileMutation } from "@/features/auth/authApi";
import { setValue, userLoggedOut } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const dispatch = useDispatch();
  const [getOwnProfile] = useGetOwnProfileMutation();
  const { replace } = useRouter();

  useEffect(() => {
    getOwnProfile(null)
      .then((res: any) => {
        dispatch(setValue({ target: "user", value: res.data.data }));
        // replace(routes.admin.dashboard);
      })
      .catch((err: any) => {
        dispatch(userLoggedOut(undefined));
        // replace(routes.adminLogin);
      });
  }, [dispatch]);

  return <>{children}</>;
}
