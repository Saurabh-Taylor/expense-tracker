"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Coins, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default function MonthlyExpenses() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  );
  const [expenses] = useState<Expense[]>([]);

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseMonth = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
    return expenseMonth === selectedMonth;
  });

  const monthlyTotal = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Generate last 12 months for the dropdown
  const getLastTwelveMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = format(date, "MMMM yyyy");
      months.push({ value, label });
    }
    return months;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {getLastTwelveMonths().map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-primary/5">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="font-medium text-muted-foreground">
                  {format(new Date(selectedMonth), "MMMM yyyy")} Total:
                </span>
              </div>
              <span className="text-primary text-xl sm:text-2xl font-bold">
                {formatIndianCurrency(monthlyTotal)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Monthly Expenses</CardTitle>
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
                  {monthlyExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No expenses found for this month
                      </TableCell>
                    </TableRow>
                  ) : (
                    monthlyExpenses
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
  );
}