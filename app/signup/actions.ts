'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // Get form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as string // 'student' or 'dentist'

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: role,
            },
            emailRedirectTo: `${baseUrl}/auth/callback`,
        },
    })

    if (error) {
        redirect('/signup?error=Could not create account')
    }

    // usually redirect to some success page or verify email
    redirect('/login?message=Check email to continue sign in process')
}
