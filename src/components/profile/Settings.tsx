"use client";

import type React from "react";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
import { ChevronDown, Edit2, Check, X } from "lucide-react";

export function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Product designer and developer based in San Francisco.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  });

  const [tempUserData, setTempUserData] = useState({ ...userData });

  const handleEdit = () => {
    setTempUserData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({ ...tempUserData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTempUserData({
      ...tempUserData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Account Settings
        </h1>
        <p className="text-gray-700">
          You can manage your Account and Billing settings here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#f4f4f5] border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">
              Personal Information
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  className="h-8 w-8 text-green-500"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="h-8 w-8 text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage
                  src="/placeholder.svg?height=64&width=64"
                  alt={userData.name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                {!isEditing ? (
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{userData.name}</h3>
                    <p className="text-sm text-gray-400">{userData.email}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="name" className="sr-only">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={tempUserData.name}
                        onChange={handleChange}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="sr-only">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={tempUserData.email}
                        onChange={handleChange}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Bio</h4>
                  <p className="mt-1">{userData.bio}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Phone</h4>
                  <p className="mt-1">{userData.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">
                    Location
                  </h4>
                  <p className="mt-1">{userData.location}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-400"
                  >
                    Bio
                  </Label>
                  {/* <Textarea
                    id="bio"
                    name="bio"
                    value={tempUserData.bio}
                    onChange={handleChange}
                    className="mt-1 bg-zinc-800 border-zinc-700"
                  /> */}
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-400"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={tempUserData.phone}
                    onChange={handleChange}
                    className="mt-1 bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-400"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={tempUserData.location}
                    onChange={handleChange}
                    className="mt-1 bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">Current Plan</h3>
                    {/* <Badge
                      variant="outline"
                      className="bg-blue-900/20 text-blue-400 border-blue-800"
                    > */}
                    {/* Basic */}
                    {/* </Badge> */}
                  </div>
                  <p className="text-sm text-gray-400">
                    Your plan renews on April 21, 2025
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  Manage
                </Button>
              </div>

              <Separator className="bg-zinc-800" />

              <div className="space-y-3">
                <h3 className="font-medium">Plan Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>5 projects</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Up to 10 team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>5GB storage</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <X className="h-4 w-4 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <X className="h-4 w-4 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {/* <h3 className="font-medium flex items-center">
                    Basic Plan
                    <Badge className="ml-2 bg-zinc-800 text-zinc-300">
                      Active
                    </Badge>
                  </h3> */}
                  <p className="text-sm text-gray-400">
                    Free tier with limited features
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="bg-primary hover:bg-primary/90">
                  Upgrade to Pro
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  Upgrade to Business
                </Button>
              </div>

              <div>
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white p-0 h-auto flex items-center"
                >
                  Advanced
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
