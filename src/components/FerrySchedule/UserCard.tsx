// components/FerrySchedule/UserCard.tsx

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UserCardProps {
  full_name: string;
  email: string;
  role: string;
}

export function UserCard({ full_name, email, role }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>
          <strong>Name:</strong> {full_name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Role:</strong> {role}
        </p>
      </CardContent>
    </Card>
  );
}
