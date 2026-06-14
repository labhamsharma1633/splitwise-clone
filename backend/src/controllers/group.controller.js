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
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: {
        id: Number(groupId),
      },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: Number(groupId),
          userId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    const member = await prisma.groupMember.create({
      data: {
        groupId: Number(groupId),
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};