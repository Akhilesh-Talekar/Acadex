'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import React, { use, useEffect } from 'react'

const LoginPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const role = user?.publicMetadata.role

    if(role){
      router.push(`/${role}`)
    }
  }, [user, router])

  return (
    <div className='min-h-screen flex items-center justify-center bg-lamaSkyLight'>
      <SignIn.Root>
        <SignIn.Step name='start' className='bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2'>
            <h1 className='text-xl font-bold flex items-center gap-2'>
              <Image src={'/logo.png'} width={24} height={24} alt=''/>
              AcadeX
            </h1>
            <h2 className='text-gray-400'>SignIn to your account</h2>

            <Clerk.GlobalError className='text-sm text-red-500'/>
            <Clerk.Field name="identifier" className='flex flex-col gap-2'>
                <Clerk.Label className='text-xs text-gray-400'>Username</Clerk.Label>
                <Clerk.Input type='text' required className='p-2 rounded-md ring-1 ring-gray-400'/>
                <Clerk.FieldError className='text-sm text-red-500'/>
            </Clerk.Field>

            <Clerk.Field name="password" className='flex flex-col gap-2'>
                <Clerk.Label className='text-xs text-gray-400'>Password</Clerk.Label>
                <Clerk.Input type='password' required className='p-2 rounded-md ring-1 ring-gray-400'/>
                <Clerk.FieldError className='text-sm text-red-500'/>
            </Clerk.Field>

            <SignIn.Action submit className='bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] glitter-button'>SignIn</SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}

export default LoginPage;
