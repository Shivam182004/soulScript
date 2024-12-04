"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getAnalytics(period = "30d") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Calculate start date based on period
  const startDate = new Date();
  switch (period) {
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "15d":
      startDate.setDate(startDate.getDate() - 15);
      break;
    case "30d":
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  // Get entries for the period
  const entries = await db.entry.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Process entries for analytics
  const moodData = entries.reduce((acc, entry) => {
    const date = entry.createdAt.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = {
        totalScore: 0,
        count: 0,
        entries: [],
      };
    }
    acc[date].totalScore += entry.moodScore;
    acc[date].count += 1;
    acc[date].entries.push(entry);
    return acc;
  }, {});

  // Calculate averages and format data for charts
  const analyticsData = Object.entries(moodData).map(([date, data]) => ({
    date,
    averageScore: Number((data.totalScore / data.count).toFixed(1)),
    entryCount: data.count,
  }));

  // Calculate overall statistics
  const overallStats = {
    totalEntries: entries.length,
    averageScore: Number(
      (
        entries.reduce((acc, entry) => acc + entry.moodScore, 0) /
        entries.length
      ).toFixed(1)
    ),
    mostFrequentMood: Object.entries(
      entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0],
    dailyAverage: Number(
      (
        entries.length / (period === "7d" ? 7 : period === "15d" ? 15 : 30)
      ).toFixed(1)
    ),
  };

  return {
    success: true,
    data: {
      timeline: analyticsData,
      stats: overallStats,
      entries,
    },
  };
}