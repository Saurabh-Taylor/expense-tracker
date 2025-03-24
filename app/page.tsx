"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Coins, CalendarDays, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Expense {
  id: string;
  date: Date;
  amount: number;
  remarks: string;
}

const formatIndianCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function Home() {
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const currentMonthTotal = expenses
    .filter(
      (expense) =>
        expense.date.getMonth() === new Date().getMonth() &&
        expense.date.getFullYear() === new Date().getFullYear()
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !remarks) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      amount: parseFloat(amount),
      remarks,
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setRemarks("");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Card className="bg-primary/5 flex-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="font-medium text-muted-foreground">Current Month:</span>
                </div>
                <span className="text-primary text-xl sm:text-2xl font-bold">
                  {formatIndianCurrency(currentMonthTotal)}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Link href="/monthly" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Monthly View
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="order-2 lg:order-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Add New Expense</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Date
                  </label>
                  <div className="flex justify-center sm:justify-start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md border w-full max-w-[350px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Amount (₹)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in INR"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Remarks
                  </label>
                  <Input
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks"
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Amount</TableHead>
                      <TableHead className="whitespace-nowrap">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No expenses added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(expense.date, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatIndianCurrency(expense.amount)}
                            </TableCell>
                            <TableCell className="max-w-[150px] sm:max-w-none truncate">
                              {expense.remarks}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}