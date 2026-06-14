import prisma from "../config/prisma.js";

export const createSettlement = async (req, res) => {
  try {
    const payerId = req.user.userId;
    const { groupId, receiverId, amount } = req.body;

    const settlement = await prisma.settlement.create({
      data: {
        groupId,
        payerId,
        receiverId,
        amount,
      },
    });

    res.status(201).json({
      success: true,
      message: "Settlement recorded successfully",
      settlement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};