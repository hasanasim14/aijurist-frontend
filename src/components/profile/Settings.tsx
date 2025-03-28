"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cities, type User } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userData, setUserData] = useState({
    name: "",
    company: "",
    city: "",
  });
  // const [storageUsage, setStorageUsage] = useState(10);
  const [tempUserData, setTempUserData] = useState({ ...userData });
  const [user, setUser] = useState<User | null>(null);

  const handleEdit = () => {
    setTempUserData({
      name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
      company: user?.companyName ?? "",
      city: user?.city ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL2 + "/update_user_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: "hasan.asim14@gmail.com",
            firstName: tempUserData.name.split(" ")[0],
            lastName: tempUserData.name.split(" ").slice(1).join(" "),
            companyName: tempUserData.company,
            city: tempUserData.city,
          }),
        }
      );

      if (response.ok) {
        toast.success("Personal Information Updated Successfully!");
      } else {
        toast.error("Failed to Update Personal Information");
      }

      // Updating the user Information
      if (user) {
        const updatedUser = {
          ...user,
          firstName: tempUserData.name.split(" ")[0],
          lastName: tempUserData.name.split(" ").slice(1).join(" "),
          companyName: tempUserData.company,
          city: tempUserData.city,
        };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
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

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const hasChanges = () => {
    if (!user) return false;

    const currentName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const currentCompany = user.companyName ?? "";
    const currentCity = user.city ?? "";

    return (
      tempUserData.name !== currentName ||
      tempUserData.company !== currentCompany ||
      tempUserData.city !== currentCity
    );
  };

  const cityOptions = useMemo(() => {
    return cities.map(({ label, value }) => (
      <SelectItem key={value} value={value}>
        {label}
      </SelectItem>
    ));
  }, []);

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
        {/* First Column: Personal Information and Account */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-[#f4f4f5] border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarFallback>
                    {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`
                      .trim()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {!isEditing ? (
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{`${
                        user?.firstName ?? ""
                      } ${user?.lastName ?? ""}`}</h3>
                      <p className="text-sm text-gray-400">{user?.email}</p>
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
                    <h4 className="text-sm font-medium text-gray-400">
                      Company
                    </h4>
                    <p className="mt-1">{user?.companyName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">City</h4>
                    <p className="mt-1">{user?.city}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="company"
                      className="text-sm font-medium text-gray-400"
                    >
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={tempUserData.company}
                      onChange={handleChange}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-400"
                    >
                      City
                    </Label>
                    <Select
                      defaultValue={user?.city}
                      name="city"
                      // value={user?.city}
                      onValueChange={(value) => {
                        setTempUserData({
                          ...tempUserData,
                          city: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      {/* <SelectGroup>{cityOptions}</SelectGroup> */}

                      <SelectContent>
                        <SelectGroup>{cityOptions}</SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Add edit/save buttons at the end of the card */}
              <div className="flex justify-end mt-4">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="border border-gray-200 cursor-pointer"
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border border-gray-200 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-primary hover:bg-primary/90 cursor-pointer"
                      disabled={!hasChanges()}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className="bg-[#f4f4f5] border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">
                    Free tier with limited features
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Plan Usage</span>
                  <span className="font-medium">10% of 125 Messages</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="bg-primary cursor-pointer">
                  Upgrade to Pro
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 cursor-pointer"
                >
                  Upgrade to Business
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Column: Subscription */}
        <Card className="bg-[#f4f4f5] border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">Current Plan</h3>
                  <Badge variant="outline" className="bg-black text-white">
                    Basic
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="space-y-3">
              {/* <h3 className="font-medium">Plan Features</h3> */}
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="font-bold">Started On:</span>
                  {/* {start date} */}
                </li>
                <li className="flex items-center">
                  <span className="font-bold">Expires On:</span>
                  {/* {end date} */}
                </li>
                <li className="flex items-center">
                  <span className="font-bold">Remaining Days:</span>
                  {/* {} */}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
