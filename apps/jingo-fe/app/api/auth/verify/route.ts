import { NextResponse } from 'next/server'

const host = process.env.SERVER_URL

export async function GET(request: Request) {
  const res = await fetch(`${host}/auth/verify`, {
    headers: {
      Authorization: request.headers.get('Authorization')!,
    },
  })

  return NextResponse.json(await res.json())
}
