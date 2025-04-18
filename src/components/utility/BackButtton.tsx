import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/")}
      className="fixed bottom-6 z-10 flex items-center px-4 py-2 shadow-sm cursor-pointer"
    >
      <ArrowLeft className="mr-2" />
      Back to Chat
    </Button>
  );
}
