import { NextResponse } from 'next/server'

const host = process.env.SERVER_URL

export async function POST(request: Request) {
  const body = JSON.stringify(await request.json())
  const res = await fetch(`${host}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body,
  })

  return NextResponse.json(await res.json())
}
