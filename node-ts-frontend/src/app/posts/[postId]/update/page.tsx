'use client'

import React from 'react'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams<{
    postId: string;
  }>();
  const postId = params.postId 

  return (
    <div>Post ID: {postId}</div>
  )
}
