"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import Icons from "../shared/icons";
import { useScopedI18n } from "@/locales/client";
import { useRouter } from "next/navigation";

const userAuthSchema = z.object({
    email: z.email(),
});

type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
    const t = useScopedI18n('auth')
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOTP] = useState("");
    const [countdown, setCountdown] = useState(30);
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAuthSchema as any),
    });

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined;

        if (countdown > 0) {
            intervalId = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };
        }
    }, [countdown]);

    async function onEmailSubmit(data: FormData) {
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }
            setCurrentStep(2);
            toast.success(
                t('otpSent'), {
                description: t('otpSentDesc'),
            }
            );
            setCountdown(30);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : t('otpFailed');
            toast.error(t('otpFailed'), {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onOTPSubmit(data: FormData) {
        setIsVerifying(true);

        try {
            const res = await fetch("/api/auth/login/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, code: otp }),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }
            setCountdown(0);
            reset();
            toast.success(
                t('verifiedSuccess')
            );
            router.refresh();
            router.back();
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(
                t('verifyFailed'), {
                description: errorMessage,
            });
        } finally {
            setIsVerifying(false);
        }
    }

    async function handleResend() {
        if (!getValues("email")) return;
        setCountdown(0);
        setOTP("");
        await onEmailSubmit(getValues());
    }

    return (
        <div className={cn("mt-4 flex max-w-full flex-col gap-4")}>
            {currentStep === 1 && (
                <>
                    <form onSubmit={handleSubmit(onEmailSubmit)}>
                        <div className="flex flex-col gap-2.5">
                            <div>
                                <Label className="sr-only" htmlFor="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    placeholder={t("emailPlaceholder")}
                                    type="email"
                                    disabled={isLoading || isGithubLoading}
                                    {...register("email")}
                                />
                                {errors?.email && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {errors?.email.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className={cn(buttonVariants())}
                                disabled={isLoading || isGithubLoading || isVerifying}
                            >
                                {isLoading && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {t("sendOtp")}
                            </button>
                        </div>
                    </form>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">/</span>
                    </div>
                    {isGithubLoading ? (
                        <Button className="w-full cursor-not-allowed" variant="outline">
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Link
                            href="/api/auth/login/github"
                            className={cn(buttonVariants({ variant: "outline" }))}
                            onClick={() => setIsGithubLoading(true)}
                        >
                            {t("continueWith")} <Icons.gitHub className="ml-2 h-4 w-4" />
                        </Link>
                    )}
                    {isGoogleLoading ? (
                        <Button className="w-full cursor-not-allowed" variant="outline">
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Link
                            href="/api/auth/login/google"
                            className={cn(buttonVariants({ variant: "outline" }))}
                            onClick={() => setIsGoogleLoading(true)}
                        >
                            {t("continueWith")} <Icons.google className="ml-2 h-4 w-4" />
                        </Link>
                    )}
                </>
            )}
            {currentStep === 2 && (
                <>
                    <p className="mb-4 text-center">
                        <span className="break-all">
                            {t("otpSentTo", { email: getValues("email") })}
                        </span>{" "}
                        {t("verifyDesc")}
                    </p>
                    <form
                        onSubmit={handleSubmit(onOTPSubmit)}
                        className="flex flex-col gap-2.5"
                    >
                        <div>
                            <Label className="sr-only" htmlFor="otp">
                                {t('enterOtp')}
                            </Label>
                            <div className="">
                                <InputOTP
                                    id="otp"
                                    autoFocus
                                    disabled={isLoading}
                                    value={otp}
                                    onChange={setOTP}
                                    maxLength={6}
                                    className="flex justify-between"
                                >
                                    <InputOTPGroup className="flex w-full items-center justify-between [&>div]:rounded-md [&>div]:border">
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isVerifying || otp.length !== 6}
                            className="mt-4"
                        >
                            {isVerifying && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t("verifyOtp")}
                        </Button>
                    </form>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>{t("didNotReceive")}</span>
                        {countdown > 0 ? (
                            <span>{t("resendIn", { countdown })}</span>
                        ) : (
                            <Button
                                variant="link"
                                onClick={handleResend}
                                className="h-auto p-0"
                                disabled={isLoading}
                            >
                                {isLoading ? t("resending") : t("resend")}
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}