import { NextResponse } from 'next/server'

const host = process.env.SERVER_URL

export async function GET() {
  const res = await fetch(`${host}/subjects/all`)

  return NextResponse.json(await res.json())
}
