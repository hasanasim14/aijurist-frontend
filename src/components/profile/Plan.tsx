import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlanProps {
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
}

export function SubscriptionPlan({
  name,
  description,
  price,
  features,
  popular = false,
  current = false,
}: SubscriptionPlanProps) {
  return (
    <Card
      className={`relative ${
        popular ? "border-primary" : "border-zinc-800"
      } bg-zinc-900`}
    >
      {popular && (
        <Badge className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-primary text-primary-foreground">
          Popular
        </Badge>
      )}
      {current && (
        <Badge className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-green-600 text-white">
          Current
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && (
            <span className="text-gray-400 ml-1">/month</span>
          )}
        </div>
        <ul className="space-y-2 text-sm">
          {features.map((feature, index) => (
            <li
              key={index}
              className={`flex items-center ${
                !feature.included ? "text-gray-500" : ""
              }`}
            >
              {feature.included ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <span className="h-4 w-4 mr-2 flex items-center justify-center">
                  -
                </span>
              )}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            current
              ? "bg-green-600 hover:bg-green-700"
              : popular
              ? "bg-primary hover:bg-primary/90"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          {current ? "Current Plan" : "Upgrade"}
        </Button>
      </CardFooter>
    </Card>
  );
}
