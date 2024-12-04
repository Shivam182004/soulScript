const { PrismaClient } = require("@prisma/client");

export const db = globalThis.primsa || new PrismaClient();

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db ;
}

// it prevent from connection issue if we don't do this new prismaclient() create new instance on every reload..