import { NextResponse } from 'next/server'

const host = process.env.SERVER_URL

export async function PUT(request: Request) {
  const body = JSON.stringify(await request.json())
  const res = await fetch(`${host}/users/update`, {
    method: 'PUT',
    headers: {
      Authorization: request.headers.get('Authorization')!,
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body,
  })

  return NextResponse.json(await res.json())
}
