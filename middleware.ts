// import {
//   clerkMiddleware,
//   createRouteMatcher,
// } from '@clerk/nextjs/server';

// // const publicRoutes = createRouteMatcher([
// //   '/sign-in', // Sign in page
// //   '/sign-up', // Sign up page
// //   "/((?!.*\\..*|_next).*)", // All other routes except public ones
// // ]);

// export default clerkMiddleware((auth, req) => {
//   // if (!publicRoutes(req)) {
//   //   auth().protect();
//   // }
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)'], // All other routes except public ones
// };
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};