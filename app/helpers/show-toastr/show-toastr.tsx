import { toast } from "@/components/ui/toast"

export function showToast({ title, description, type = 'default' }: { title: string, description: string, type?: string }): void {
    toast.add({
        title,
        description,
        type
    })
}
