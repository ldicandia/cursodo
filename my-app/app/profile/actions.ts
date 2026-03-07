'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        redirect('/login')
    }

    const name = formData.get('name') as string

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: name,
        }
    })

    if (error) {
        redirect('/profile?error=Could not update profile')
    }

    revalidatePath('/profile')
    revalidatePath('/', 'layout')
    redirect('/profile?message=Profile updated successfully')
}
