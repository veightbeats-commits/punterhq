"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { FormState } from "@/components/status-form"

export async function uploadImage(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("uploadImage action called")
    console.log("formData:", formData)
    const supabase = await createClient()
    const imageFile = formData.get('image') as File
    console.log("imageFile:", imageFile)
    const filename = `${Date.now()}-${imageFile.name}`

    const { data, error } = await supabase.storage
        .from('status-card-images')
        .upload(filename, imageFile)

    if (error) {
        console.error("Upload error:", error)
        return { error: 'Failed to upload image', success: null }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('status-card-images')
        .getPublicUrl(filename)

    return addStatusCard(publicUrl, formData)
}

export async function addStatusCard(imageUrl: string, formData: FormData): Promise<FormState> {
    console.log("Server Action: addStatusCard called")
    const supabase = await createClient()

    const name = formData.get("name") as string
    const betwayLink = formData.get("betway_link") as string
    const socialLink = formData.get("social_link") as string | null

    console.log("Received data:", { name, imageUrl, betwayLink, socialLink })

    if (!name || !imageUrl || !betwayLink) {
        console.error("Validation failed: Missing fields")
        return { error: "Please fill in all required fields", success: null }
    }

    const { error } = await supabase.from("status_cards").insert({
        name,
        image_url: imageUrl,
        betway_link: betwayLink,
        social_link: socialLink,
    })

    if (error) {
        console.error("Supabase insert error:", error)
        return { error: "Failed to add card: " + error.message, success: null }
    }

    console.log("Success: Card added")
    revalidatePath("/status")
    revalidatePath("/admin/status")

    return { success: "Card added successfully", error: null }
}

export async function updateStatusCard(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("Server Action: updateStatusCard called")
    const supabase = await createClient()

    const id = formData.get("id") as string | null
    const name = formData.get("name") as string | null
    const betwayLink = formData.get("betway_link") as string | null
    const socialLink = formData.get("social_link") as string | null

    if (!id || !name || !betwayLink) {
        console.error("Validation failed: Missing fields for update")
        return { error: "ID, name and Betway link are required", success: null }
    }

    let imageUrl: string | null = null

    const maybeImage = formData.get("image")

    if (maybeImage && maybeImage instanceof File && maybeImage.size > 0) {
        // New image uploaded: store it and use its public URL
        const filename = `${Date.now()}-${maybeImage.name}`

        const { error: uploadError } = await supabase.storage
            .from("status-card-images")
            .upload(filename, maybeImage)

        if (uploadError) {
            console.error("Upload error on update:", uploadError)
            return { error: "Failed to upload new image", success: null }
        }

        const { data: publicData } = supabase.storage
            .from("status-card-images")
            .getPublicUrl(filename)

        imageUrl = publicData.publicUrl
    } else {
        // No new image provided: keep existing image_url
        const { data: existing, error: fetchError } = await supabase
            .from("status_cards")
            .select("image_url")
            .eq("id", id)
            .single()

        if (fetchError) {
            console.error("Failed to fetch existing status card for update:", fetchError)
            return { error: "Failed to load existing card image", success: null }
        }

        imageUrl = existing?.image_url ?? null
    }

    if (!imageUrl) {
        return { error: "Image URL is missing; please upload an image again", success: null }
    }

    const { error } = await supabase
        .from("status_cards")
        .update({
            name,
            betway_link: betwayLink,
            social_link: socialLink,
            image_url: imageUrl,
        })
        .eq("id", id)

    if (error) {
        console.error("Supabase update error:", error)
        return { error: "Failed to update card: " + error.message, success: null }
    }

    console.log("Success: Card updated")
    revalidatePath("/status")
    revalidatePath("/admin/status")

    return { success: "Card updated successfully", error: null }
}

export async function deleteStatusCard(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("Server Action: deleteStatusCard called")
    const supabase = await createClient()

    const id = formData.get("id") as string | null

    if (!id) {
        return { error: "Missing card ID", success: null }
    }

    const { error } = await supabase
        .from("status_cards")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Supabase delete error:", error)
        return { error: "Failed to delete card: " + error.message, success: null }
    }

    console.log("Success: Card deleted")
    revalidatePath("/status")
    revalidatePath("/admin/status")

    return { success: "Card deleted successfully", error: null }
}
