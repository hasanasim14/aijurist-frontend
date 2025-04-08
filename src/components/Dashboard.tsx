"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          <h1>Welcome Back</h1>
          {JSON.stringify(session)}
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <Button onClick={() => signIn("google")}>Sign in to Google</Button>
        </>
      )}
    </>
  );
};

export default Dashboard;
