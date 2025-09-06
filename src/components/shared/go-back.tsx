"use client";
import { useRouter } from "next/navigation";
import Icons from "./icons";
import { Button } from "../ui/button";
import { useScopedI18n } from "@/locales/client";

export default function GoBack() {
  const router = useRouter();
  const scopedT = useScopedI18n('shared')
  return (
    <Button
      className="mb-5"
      size="icon"
      variant="secondary"
      onClick={() => router.back()
      }
    >
      <span className="sr-only" > {scopedT('goBack')} </span>
      < Icons.moveLeft className="h-5 w-5" />
    </Button>
  );
}