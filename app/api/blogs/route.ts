import {createClient} from '@/utils/supabase/server'
import {cookies} from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const response = await supabase.from('blogs').select().limit(20)

  return Response.json(response)
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const data = await request.json()
  const response = await supabase.from('blogs').insert(data).select().single()

  return Response.json(response)
}

export async function PATCH(request: Request) {
    
}

export async function DELETE(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const data = await request.json()
  const response = await supabase.from('blogs').delete().eq('id', data.id)

  return Response.json(response)
}