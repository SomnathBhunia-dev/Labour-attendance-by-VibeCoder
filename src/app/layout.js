import { Inter } from 'next/font/google'
import './globals.css'
import { StateProvider } from '@/context/context'
import AuthWrapper from '@/component/AuthWrapper'
import AppContent from '@/component/AppContent'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        <StateProvider>
          <AuthWrapper>
            <div className="mobile-viewport">
              <AppContent>{children}</AppContent>
            </div>
          </AuthWrapper>
        </StateProvider>
      </body>
    </html>
  )
}


