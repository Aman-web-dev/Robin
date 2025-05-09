"use client";
import React, { use, useEffect,useState} from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { signupUserType, loginUserType } from "../../../../type";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { login, isLoggedIn ,user } = useAuth();
  const [loading,setLoading]=useState(false);  

  const para = useParams();
  console.log(para);

  const handleSignupOrLogin = async (obj: signupUserType | loginUserType) => {
    setLoading(true);
    const endpoint =
      para.slug === "signup" ? "/api/user/signup" : "/api/user/login";
    try {
      const response = await axios.post(endpoint, obj);
      if (para.slug === "login") {
        console.log("Post Login User Details",response.data.user)
        login(response.data.user, response.data.token);
        setLoading(false);
      }
      console.log(response.data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (para.slug === "login" && user) {
      redirect("/dashboard");
    }
  }, [isLoggedIn]);

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
          handleSignUpOrLogin={handleSignupOrLogin}
          loading={loading}
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
