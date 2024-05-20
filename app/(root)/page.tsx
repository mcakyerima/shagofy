import {SignIn, SignInButton, SignOutButton, SignedOut, UserButton, UserProfile } from '@clerk/nextjs'
 const SetupPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <UserButton afterSignOutUrl='/'/>
        <SignOutButton redirectUrl="/sign-in"/>
        <SignedOut>
          <SignInButton/>
        </SignedOut>
    </main>
  );
}

export default SetupPage;