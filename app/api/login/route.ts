import { connectToDb } from "@/utils"
import prisma from "@/prisma"
import { NextResponse } from "next/server"
import bcrypt  from "bcrypt"

export const POST = async (req:Request) => {
    try{
        const { email, password} = await req.json()
        if (!email && !password){
            return NextResponse.json({error:"Invalid Data"}, {status:442})
        }
        await connectToDb();
        const existingUser = await prisma.user.findFirst({where:{email}})
        
        if(!existingUser){
            return NextResponse.json({message:"user not registered"}, {status:404})
        }
        const isPasswordCorrect = bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect){
            return NextResponse.json({error:'Invalid Password'}, {status:403})
        }
        return NextResponse.json({message:"Logged in"}, {status:200})
    }catch(error){
        console.log(error)
        return NextResponse.json({error}, {status:500})
    } finally{
        await prisma.$disconnect();
    }
}