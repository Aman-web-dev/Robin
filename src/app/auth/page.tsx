"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { Navigate } from "react-router-dom";
import {redirect} from "next/navigation";

function page() {
  const {isLoggedIn}=useAuth();
  if(isLoggedIn){
    redirect("/dashboard")
  }
  return <div>
    Hello
  </div>;
}

export default page;
