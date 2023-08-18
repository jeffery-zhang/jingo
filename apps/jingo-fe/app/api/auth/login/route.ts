import { NextResponse } from 'next/server'

const host = process.env.SERVER_URL

export async function POST(request: Request) {
  const res = await fetch(`${host}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(request.body),
  })

  return NextResponse.json(await res.json())
}
