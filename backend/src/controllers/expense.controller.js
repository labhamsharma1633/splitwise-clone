import prisma from "../config/prisma.js";

export const createExpense = async (req, res) => {
  try {
    const {
      description,
      amount,
      groupId,
      splitType,
      participants,
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

    // Equal split
    const splitAmount = amount / participants.length;

    const splits = participants.map((userId) => ({
      expenseId: expense.id,
      userId,
      amount: splitAmount,
    }));

    await prisma.expenseSplit.createMany({
      data: splits,
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