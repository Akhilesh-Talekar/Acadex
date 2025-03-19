import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routAccessMap } from "./lib/settings";
import { create } from "domain";
import { strict } from "assert";
import { NextResponse } from "next/server";


const matchers = Object.keys(routAccessMap).map((route) => {
  return {
    matcher: createRouteMatcher([route]),
    allowedRoutes: routAccessMap[route],
  }
})

export default clerkMiddleware(async (auth, req) => {

  const sessionClaims = (await auth()).sessionClaims;
  const role = (sessionClaims?.metadata as {role?:string})?.role;

  for(const {matcher, allowedRoutes} of matchers){
     if(matcher(req) && !allowedRoutes.includes(role!)){
        return NextResponse.redirect(new URL (`/${role}`, req.url));
     }
       
  }
    
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};