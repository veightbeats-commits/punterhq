"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormState } from "@/components/status-form"
import { updateStatusCard, deleteStatusCard } from "@/app/admin/status/actions"
import { toast } from "sonner"

const initialState: FormState = {
  error: null,
  success: null,
}

interface StatusAdminListProps {
  cards: {
    id: string
    name: string
    image_url: string
    betway_link: string
    social_link?: string | null
  }[]
}

export function StatusAdminList({ cards }: StatusAdminListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [updateState, updateAction, updatePending] = useActionState(updateStatusCard, initialState)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteStatusCard, initialState)

  useEffect(() => {
    if (updateState?.error) {
      toast.error(updateState.error)
    }
    if (updateState?.success) {
      toast.success(updateState.success)
      setEditingId(null)
    }
  }, [updateState])

  useEffect(() => {
    if (deleteState?.error) {
      toast.error(deleteState.error)
    }
    if (deleteState?.success) {
      toast.success(deleteState.success)
    }
  }, [deleteState])

  if (!cards || cards.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-primary/20 bg-background/60">
        <CardHeader>
          <CardTitle className="text-lg font-mono uppercase tracking-widest text-center">
            Existing Status Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            No status cards found. Use the form above to create your first card.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-primary/20 bg-background/60">
      <CardHeader>
        <CardTitle className="text-lg font-mono uppercase tracking-widest text-center">
          Existing Status Cards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cards.map((card) => {
            const isEditing = editingId === card.id

            return (
              <div
                key={card.id}
                className="border border-border/60 rounded-lg p-4 bg-background/80 space-y-3"
              >
                {!isEditing ? (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-muted-foreground">ID:</span>
                        <span className="text-xs font-mono break-all opacity-80">{card.id}</span>
                      </div>
                      <div className="font-mono font-semibold text-sm">{card.name}</div>
                      <div className="text-xs text-muted-foreground break-all">
                        Betway: {card.betway_link}
                      </div>
                      {card.social_link && (
                        <div className="text-xs text-muted-foreground break-all">
                          Social: {card.social_link}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 md:self-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(card.id)}
                        className="font-mono text-xs uppercase tracking-widest"
                      >
                        Edit
                      </Button>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={card.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          size="sm"
                          disabled={deletePending}
                          className="font-mono text-xs uppercase tracking-widest"
                        >
                          {deletePending ? "Deleting..." : "Delete"}
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <form action={updateAction} className="space-y-3">
                    <input type="hidden" name="id" value={card.id} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`name-${card.id}`} className="text-xs font-mono uppercase tracking-widest">
                          Name
                        </Label>
                        <Input
                          id={`name-${card.id}`}
                          name="name"
                          defaultValue={card.name}
                          required
                          className="bg-background border-input h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`betway-${card.id}`}
                          className="text-xs font-mono uppercase tracking-widest"
                        >
                          Betway Link
                        </Label>
                        <Input
                          id={`betway-${card.id}`}
                          name="betway_link"
                          defaultValue={card.betway_link}
                          required
                          className="bg-background border-input h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`social-${card.id}`}
                          className="text-xs font-mono uppercase tracking-widest"
                        >
                          Social Link (optional)
                        </Label>
                        <Input
                          id={`social-${card.id}`}
                          name="social_link"
                          defaultValue={card.social_link ?? ""}
                          className="bg-background border-input h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`image-${card.id}`}
                          className="text-xs font-mono uppercase tracking-widest"
                        >
                          New Image (optional)
                        </Label>
                        <Input
                          id={`image-${card.id}`}
                          name="image"
                          type="file"
                          className="bg-background border-input h-8 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Leave empty to keep the existing image.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="font-mono text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={updatePending}
                        className="font-mono text-xs uppercase tracking-widest"
                      >
                        {updatePending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
