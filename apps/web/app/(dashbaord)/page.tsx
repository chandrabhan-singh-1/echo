"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users = useQuery(api.users.getUsers, {});
  const addUser = useMutation(api.users.addUser);

  return (
    <>
      <div className="flex items-center justify-center min-h-svh">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Web</h1>
          <UserButton />
          <OrganizationSwitcher hidePersonal />
          {users?.map((user) => (
            <div key={user._id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
            </div>
          ))}
          <Button size="sm" onClick={() => addUser({})}>
            Add User
          </Button>
        </div>
      </div>
    </>
  );
}
