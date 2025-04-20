"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";

import {redirect} from "next/navigation";

function page() {

  const {isLoggedIn}=useAuth();

  if(isLoggedIn){
    redirect("/dashboard")
  }


  useEffect(() => {
    axios
      .get("/api/requests")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error Fetching data");
      });
  });
  return <div>
    Hello
  </div>;
}

export default page;
