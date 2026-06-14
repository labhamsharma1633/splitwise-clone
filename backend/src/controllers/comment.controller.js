import prisma from "../config/prisma.js";
import { io } from "../../server.js";

export const addComment = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { message } = req.body;

    const userId = req.user.userId;

    const comment = await prisma.expenseComment.create({
      data: {
        expenseId: Number(expenseId),
        userId,
        message,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Real-time emit
    io.to(`expense-${expenseId}`).emit(
      "newComment",
      comment
    );

    res.status(201).json({
      success: true,
      comment,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const comments = await prisma.expenseComment.findMany({
      where: {
        expenseId: Number(expenseId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};