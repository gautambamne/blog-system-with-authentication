'use client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function page() {
    const {postid} = useParams<{
        postid: string
    }>()
  return (
    <div>page{postid}</div>
  )
}
