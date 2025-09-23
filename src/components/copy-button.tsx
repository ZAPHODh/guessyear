'use client'

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CopyButtonProps {
    text: string
    className?: string
}

export function CopyButton({
    text,
    className,
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {

            await navigator.clipboard.writeText(text)


            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy text:", err)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className={className}
            onClick={copyToClipboard}
        >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Compartilhar"}
        </Button>
    )
}