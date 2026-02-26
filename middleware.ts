import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')
    const path = request.nextUrl.pathname

    const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/create-profile') || path.startsWith('/admin') || path.startsWith('/superadmin')
    const isAdminRoute = path.startsWith('/admin')
    const isSuperadminRoute = path.startsWith('/superadmin')

    if (isProtectedRoute && !sessionCookie?.value) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (sessionCookie?.value) {
        try {
            const session = JSON.parse(sessionCookie.value) as { id: number, name: string, role: string }

            if (isAdminRoute && !['ADMIN', 'SUPERADMIN'].includes(session.role)) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }

            if (isSuperadminRoute && session.role !== 'SUPERADMIN') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }

            // Redirect logged-in users away from auth pages
            if (path === '/login' || path === '/register') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        } catch (e) {
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/create-profile/:path*',
        '/admin/:path*',
        '/superadmin/:path*',
        '/login',
        '/register'
    ],
}
