'use client'
import { useStateValue } from '@/context/context'
import BottomNavBar from '@/component/BottomNavBar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function AppContent({ children }) {
    const { isAuthenticated } = useStateValue()
    const pathname = usePathname()
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState('dashboard')

    useEffect(() => {
        const page = pathname.split('/').pop()
        setCurrentPage(page || 'dashboard')
    }, [pathname])

    const handleNavClick = (e, page) => {
        e.preventDefault()
        router.push(`/${page}`)
    }

    const showNavBar = isAuthenticated && pathname !== '/signin'

    return (
        <>
            {children}
            {showNavBar && <BottomNavBar currentPage={currentPage} onNavClick={handleNavClick} />}
        </>
    )
}