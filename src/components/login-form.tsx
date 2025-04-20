"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { loginUserType, signupUserType } from "../../type";

import { useState } from "react";

type AuthUser = Partial<signupUserType & loginUserType>;



export function LoginForm({
  className,
  mode,
  handleSignUpOrLogin,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  mode: "login" | "signup";
  handleSignUpOrLogin: (obj: signupUserType | loginUserType) => void;
}) {
  const [user, setUser] = useState<AuthUser>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const checkValidationAndSignup = async(
    e: React.MouseEvent,
    obj: signupUserType | loginUserType
  ): Promise<boolean> => {
    e.preventDefault();
    console.log("checkingValidation",obj)
    if (obj.password.length < 6 && obj.password.length > 20) {
      alert("Password should be at least 6 characters long");
      return false;
    }
    if (
      !obj.email.includes("@") &&
      !obj.email.includes(".") &&
      !obj.email.includes("@") &&
      obj.email.length < 3
    ) {
      alert("Email should be valid");
      return false;
    }


    if (mode === "signup") {
      const signupObj = obj as signupUserType;
    
      if (signupObj.password !== signupObj.confirmPassword) {
        alert("Password and confirm password should be same");
        return false;
      }
    
      if (
        signupObj.name.length < 3 ||
        signupObj.name.length > 20 ||
        signupObj.name.includes(".") ||
        signupObj.name.includes("@")
      ) {
        alert("Name should be valid");
        return false;
      }
    }
    const resp = handleSignUpOrLogin(obj);
    setUser({ name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    return true;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Welcome {mode == "login" && "back"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {mode === "signup" && (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Name</Label>
                    <Input
                      name="name"
                      id="name"
                      value={user.name || ""}
                      onChange={handleChange}
                      autoComplete="name"
                      autoFocus
                      type="text"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      maxLength={20}
                      minLength={3}
                      onInvalid={(e) => {
                        e.preventDefault();
                        e.currentTarget.setCustomValidity(
                          "Name should be at least 3 characters long"
                        );
                      }}
                      placeholder="Narendra Modi"
                      required
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    id="email"
                    type="email"
                    placeholder="namo@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    )}
                  </div>
                  <Input
                  onChange={handleChange}
                    name="password"
                    value={user.password}
                    required
                    id="password"
                    type="password"
                  />
                </div>
                {mode === "signup" && (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Confirm Password</Label>
                    </div>
                    <Input onChange={handleChange} value={user.confirmPassword || ""} name="confirmPassword" id="confirm_password" type="password" required />
                  </div>
                )}

                <Button
                  onClick={(e) => {
                    if (
                      user.email &&
                      user.password &&
                      (mode === "login" || (user.name && user.confirmPassword))
                    ) {
                      checkValidationAndSignup(e, user as signupUserType | loginUserType);
                    } else {
                      alert("Please fill in all required fields.");
                    }
                  }}
                  className="w-full"
                >
                  {mode == "login" ? "Login" : "Signup"}
                </Button>
              </div>
              <div className="text-center text-sm">
                {mode === "login" && <span>Don&apos;t</span>} have an
                account?{" "}
                <Link
                  href={mode == "login" ? "/auth/signup" : "/auth/login"}
                  className="underline underline-offset-4"
                >
                  {mode == "login" ? "Sign up" : "Log in"}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
