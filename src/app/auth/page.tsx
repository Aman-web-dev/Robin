"use client";

import React, { useEffect } from "react";
import axios from "axios";

function page() {
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
