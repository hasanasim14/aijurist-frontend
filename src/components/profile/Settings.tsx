"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cities, formatDate, type User } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Save,
  X,
  CreditCard,
  Building,
  MapPin,
  Mail,
  UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";

export function Settings() {
  interface SubscriptionPlan {
    _id: string;
    name: string;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    company: "",
    city: "",
  });
  const [tempUserData, setTempUserData] = useState({ ...userData });
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);

  const handleEdit = () => {
    setTempUserData({
      name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
      company: user?.companyName ?? "",
      city: user?.city ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("authToken");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/update_user_details",
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
  }, [cities]);

  // Get Plan Updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/return_subscription_plans",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ flag: "false" }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          setSubscriptionPlans(data.data.subscription_plans);
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };

    fetchData();
  }, []);

  // Plan change handling
  const handlePlanChange = async (planId: string) => {
    console.log("Tha plan id", planId);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/update_plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user?.email,
            subscriptionType: planId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error in handlePlanChange:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Account Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information, account details, and subscription
          preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar with user profile summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 w-full">
            <Card className="bg-white shadow-sm border-0 overflow-hidden w-full border">
              <div className="bg-gradient-to-r from-primary/90 to-primary h-24"></div>
              <div className="px-6 pb-6 -mt-12">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`
                      .trim()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <h2 className="text-xl font-bold">{`${
                    user?.firstName ?? ""
                  } ${user?.lastName ?? ""}`}</h2>
                  <p className="text-gray-500 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    {user?.email}
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{user?.companyName || "No company set"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{user?.city || "No location set"}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white shadow-sm border-0 border">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription className="sr-only">
                    Update your personal details
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-sm">Full Name</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{`${user?.firstName ?? ""} ${
                          user?.lastName ?? ""
                        }`}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-sm">Email</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-sm">Company</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{user?.companyName || "Not specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-sm">City</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{user?.city || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-500 text-sm">
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          value={tempUserData.name}
                          onChange={handleChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={user?.email || ""}
                          disabled
                          className="pl-9 bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-gray-500 text-sm"
                      >
                        Company
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="company"
                          name="company"
                          value={tempUserData.company}
                          onChange={handleChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-500 text-sm">
                        City
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
                        <Select
                          defaultValue={user?.city}
                          name="city"
                          onValueChange={(value) => {
                            setTempUserData({
                              ...tempUserData,
                              city: value,
                            });
                          }}
                        >
                          <SelectTrigger className="pl-9 w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectGroup>{cityOptions}</SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-200 cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-primary hover:bg-primary/90 cursor-pointer"
                      disabled={!hasChanges()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card className="bg-white shadow-sm border">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="mb-3">Subscription Details</CardTitle>
              <CardDescription className="sr-only">
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user?.subscription?.plan_name || ""}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Free tier with limited features
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                    Active
                  </Badge>
                </div>

                {/* Plan usage progress bar */}
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plan Usage</span>
                    <span className="font-medium">10% of 125 Messages</span>
                  </div>
                  <Progress value={10} className="h-2 bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Started On</div>
                    <div className="font-medium">
                      {formatDate(user?.subscription?.starts_at || "")}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Expires On</div>
                    <div className="font-medium">
                      {formatDate(user?.subscription?.expires_at || "")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {subscriptionPlans
                    .filter((plan) => plan.name !== "Free Trial")
                    .map((plan) => (
                      <Button
                        key={plan._id}
                        className={
                          plan.name === "Basic"
                            ? "bg-primary hover:bg-primary/90 cursor-pointer"
                            : "border-gray-200 cursor-pointer"
                        }
                        variant={plan.name === "Basic" ? "default" : "outline"}
                        onClick={() => handlePlanChange(plan._id)}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
