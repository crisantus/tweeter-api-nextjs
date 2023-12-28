import { connectToDb } from "@/utils"
import prisma from "@/prisma"
import { NextResponse } from "next/server"
//import bcrypt  from "bcrypt"

export const POST = async (req:Request) => {
    try{
        const {name, email, password} = await req.json()
        if (!name && !email && !password){
            return NextResponse.json({error:"Invalid Data"}, {status:442})
        }
        await connectToDb();
        
        // this can be done with @unique via email user model
        const existingUser = await prisma.user.findFirst({where:{email}})
        if (existingUser)  return NextResponse.json({message:"user alread exist please login"}, {status:403})
        //const hashedPassword = await bcrypt.hash(password,10)

        const user = await prisma.user.create({data:{name, email, password}})
        return NextResponse.json({user}, {status:201})
    }catch(error){
        console.log(error)
        return NextResponse.json({error}, {status:500})
    } finally{
        await prisma.$disconnect();
    }
}