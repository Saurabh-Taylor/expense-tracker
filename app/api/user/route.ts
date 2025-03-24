import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export  async function GET(req:NextRequest, res:NextResponse) {
  try {
    await dbConnect();
    console.log("db Connected successfully");
    return NextResponse.json({
      message : "success"
    }, {status : 200})
  } catch (error) {
    
  }
}
