"use client";
import React, { useEffect } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { signupUserType, loginUserType } from "../../../../type";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const para = useParams();
  const {login,isLoggedIn} = useAuth();  

  if(isLoggedIn) {
    redirect("/dashboard");
  }


  console.log(para);
  const router = useRouter();

  const handleSignupAndLogin = async (obj: signupUserType | loginUserType) => {
    const endpoint =
      para.slug === "signup" ? "/api/user/signup" : "/api/user/login";
    try {
      const response = await axios.post(endpoint, obj);
      login(response.data.user,response.data.token);
      console.log(response.data);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Robin.
        </a>
        <LoginForm
          handleSignupAndLogin={handleSignupAndLogin}
          mode={
            typeof para.slug === "string" &&
            (para.slug === "login" || para.slug === "signup")
              ? para.slug
              : "login"
          }
        />
      </div>
    </div>
  );
}
