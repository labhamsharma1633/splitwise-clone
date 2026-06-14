import prisma from "../config/prisma.js";

export const createExpense = async (req, res) => {
  try {
    const {
      description,
      amount,
      groupId,
      splitType,
      participants,
      splits,
    } = req.body;

    const paidById = req.user.userId;

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        groupId,
        paidById,
        splitType,
      },
    });

    let expenseSplits = [];

    // EQUAL Split
    if (splitType === "EQUAL") {
      const splitAmount = amount / participants.length;

      expenseSplits = participants.map((userId) => ({
        expenseId: expense.id,
        userId,
        amount: splitAmount,
      }));
    }

    // UNEQUAL Split
    else if (splitType === "UNEQUAL") {
      expenseSplits = splits.map((split) => ({
        expenseId: expense.id,
        userId: split.userId,
        amount: split.amount,
      }));
    }

    // PERCENTAGE Split
    else if (splitType === "PERCENTAGE") {
      expenseSplits = splits.map((split) => ({
        expenseId: expense.id,
        userId: split.userId,
        percentage: split.percentage,
        amount: (amount * split.percentage) / 100,
      }));
    }

    // SHARE Split
    else if (splitType === "SHARE") {
      const totalShares = splits.reduce(
        (sum, split) => sum + split.shares,
        0
      );

      expenseSplits = splits.map((split) => ({
        expenseId: expense.id,
        userId: split.userId,
        shares: split.shares,
        amount: (amount * split.shares) / totalShares,
      }));
    }

    await prisma.expenseSplit.createMany({
      data: expenseSplits,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};