"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadImage } from "@/app/admin/status/actions"
import { toast } from "sonner"

export type FormState = {
    error: string | null;
    success: string | null;
};

const initialState: FormState = {
    error: null,
    success: null
}

export function StatusForm() {
    const [state, dispatch, isPending] = useActionState(uploadImage, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(state.success)
        }
    }, [state])

    return (
        <Card className="w-full max-w-md mx-auto border-primary/20 bg-background text-foreground">
            <CardHeader>
                <CardTitle className="text-2xl font-bold font-mono">BACKEND FORM</CardTitle>
                <CardDescription>Add a new punder status card</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider">Name</Label>
                        <Input id="name" name="name" placeholder="Enter name" required className="bg-background border-input" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-sm font-bold uppercase tracking-wider">Image Upload</Label>
                        <Input id="image" name="image" type="file" required className="bg-background border-input" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="betway_link" className="text-sm font-bold uppercase tracking-wider">Betway Link</Label>
                        <Input id="betway_link" name="betway_link" placeholder="https://new.betway.co.za/code=..." required className="bg-background border-input" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="social_link" className="text-sm font-bold uppercase tracking-wider">Social Media Link</Label>
                        <Input id="social_link" name="social_link" placeholder="https://instagram.com/..." className="bg-background border-input" />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isPending ? "Saving..." : "Save Card"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
