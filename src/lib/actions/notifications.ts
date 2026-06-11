"use server";

import { prisma } from "@/lib/prisma";

export async function createNotification(
  userId: string,
  message: string,
  type: "PROPOSAL_RECEIVED" | "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "PROJECT_COMPLETED",
) {
  await prisma.notification.create({
    data: { userId, message, type },
  });
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function markAsRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}
