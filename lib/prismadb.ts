import { PrismaClient } from '@prisma/client';

// declaring prisma client as global 
declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

// if we are in production, we reset that
if (process.env.NODE_ENV === 'production') {
  globalThis.prisma = prismadb;
}

export default prismadb;