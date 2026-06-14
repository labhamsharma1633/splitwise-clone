import prisma from "../config/prisma.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        createdById: userId,

        members: {
          create: {
            userId,
          },
        },
      },

      include: {
        members: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};