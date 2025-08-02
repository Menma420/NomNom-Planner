import { Prisma, PrismaClient } from '@prisma/client'

// Global type declaration for Prisma client
declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// Configure Prisma client based on environment
if(process.env.NODE_ENV === "production"){
    // In production, create new instance each time
    prisma = new PrismaClient();
}else{
    // In development, reuse global instance to prevent multiple connections
    if(!global.prisma){
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export {prisma};