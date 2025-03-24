import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transaction.model";

export const dynamic = 'force-dynamic';

export async function GET(req:NextRequest) {
    try {

        await dbConnect();

        // Fetch all transactions (expenses) from the database
        const transactions = await Transaction.find({});
        return NextResponse.json({
            data: transactions,
            message : "success"
          }, {status : 200})
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({ error: error.message}, { status: 500 });
    }
}

export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const { date, amount, remarks } = await req.json()

        if (!amount || !remarks) {
            return NextResponse.json({ error: 'Amount and remarks are required' }, { status: 400 });
        }

        const newTransaction = new Transaction({
            date: date,
            amount,
            remarks,
        });
        const savedTransaction = await newTransaction.save();
        return NextResponse.json(savedTransaction, { status: 201 });

    } catch (error:any) {
        console.error(error);
        return NextResponse.json({ error: error.message}, { status: 500 });
    }
}