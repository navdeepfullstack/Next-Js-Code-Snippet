import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';
import routes, { protectedRoutes } from './routes/routes';

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const { access_token } = cookies;

  const isrouteProtected = protectedRoutes.some(pathname => req.nextUrl.pathname.startsWith(pathname));
  console.log('isrouteProtected: ', isrouteProtected);

  if (access_token && req.nextUrl.pathname.startsWith('/auth')) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  else if (!access_token && isrouteProtected) {
    const url = req.nextUrl.clone();
    url.pathname = routes.auth;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
