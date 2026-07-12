import Link from 'next/link'
import React from 'react'
import { Collection } from '@/sanity/types'
import APIS from '@/sanity/api'

const Header = async () => {
    const config = await APIS.getConfig()

    return (
        <header className='px-6 rounded-lg border bg-white/80 backdrop-blur-md border-gray-200 shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-4 mt-(--header-gutter-width) w-[calc(100%-2*(var(--header-gutter-width)))] fixed z-30 top-2 flex justify-between ml-(--header-gutter-width)'>
            <Link href={"/"}>
                <span className='text-xl font-bold'>കുടുംബജ്യോതി</span>
            </Link>
            <div className='gap-x-4 flex items-center'>
                <span>Menu</span>
            </div>
        </header>
    )
}

export default Header