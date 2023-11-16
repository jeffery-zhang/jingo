import { NextResponse } from 'next/server'

const host = process.env.SERVER_URL

export async function PUT(request: Request) {
  const body = await request.formData()
  console.log('in route----- ', body)
  const res = await fetch(`${host}/obs/batchUpload`, {
    method: 'PUT',
    body,
  })

  return NextResponse.json(await res.json())
}
