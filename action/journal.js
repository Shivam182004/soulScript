'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getMoodById, MOODS } from "@/app/lib/moods";
import { getPixabayImage } from "./public";
import { request } from "@arcjet/next";
import aj from "@/app/lib/arcjet";

export async function createJournalEntry(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

  //arcjet rate limiting
  const req = await request()

  const decision =await aj.protect({req,userId, requested:1, });

  if(decision.isDenied()){
    if(decision.reason.isRateLimit()){
      const {remaining, reset} = decision.reason;
      console.error({
        code:"RATE_LIMIT_EXCEEDED",
        details:{
          remaining,
          resetInSeconds:reset,
        },
      });

      throw new Error("Too many requests. Try again later.");
    }
    throw new Error("Request blocked.");
  }



    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User Not Found");
    }

    //get mood data 
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");
    

    //get the image for the mood
    const moodImageUrl = await getPixabayImage(data.moodQuery);
   

    //create the entry 
    const entry = await db.entry.create({
        data: {
          title: data.title,
          content: data.content,
          mood: mood.id,
          moodScore: mood.score,
          moodImgUrl: moodImageUrl,
          userId: user.id,
          collectionId: data.collectionId || null,
        },
      });

      await db.draft.deleteMany({
        where: { userId: user.id },
      });
  
      revalidatePath("/dashboard");
      return entry;

  } catch (error) {
    throw new Error(error.message);
  }  

}


export async function getJournalEntries({collectionId,
  orderBy="desc"
 }={}) {
  try {
    const {userId} = await auth();
    if(!userId) throw new Error ("Unauthorized");

    const user = await db.user.findUnique({
      where: {clerkUserId: userId},
    });

    if(!user) throw new Error("User Not Found");

    const entries = await db.entry.findMany({
      where:{
        userId:user.id,
        ...(collectionId === "unorganized" ?{collectionId:null}:collectionId ?{collectionId}:{}),
      },
      include:{
        collection:{
          select:{
            id:true,
            name:true,
          },
        },
      },
      orderBy:{
        createdAt: orderBy,
      }, 
    });

    const entriesWithMoodData = entries.map((entry=>({
       ...entry,
       moodData: getMoodById(entry.mood),
    })));

    return{
      success:true,
      data:{
        entries: entriesWithMoodData,
      },
    };
    
  } catch (error) {
     return{success:false, error: error.message};
  }
}


// export async function getJournalEntry(id) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) throw new Error("User not found");

//     const entry = await db.entry.findFirst({
//       where: {
//         id,
//         userId: user.id,
//       },
//       include: {
//         collection: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     });

//     if (!entry) throw new Error("Entry not found");

//     return entry;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }




// export async function getJournalEntry(id) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) throw new Error("User not found");

//     const entry = await db.entry.findFirst({
//       where: {
//         id,
//         userId: user.id,
//       },
//       include: {
//         collection: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     });

//     if (!entry) throw new Error("Entry not found");

//     return entry;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }


export async function deleteJournalEntry(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if entry exists and belongs to user
    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!entry) throw new Error("Entry not found");

    // Delete the entry
    await db.entry.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function getJournalEntry(id) {
  try {
    // 1. Get the authenticated user's ID
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 2. Fetch the user from the database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // 3. Fetch the journal entry, including related data
    const entry = await db.entry.findFirst({
      where: {
        id, // Match the entry ID
        userId: user.id, // Ensure the entry belongs to the authenticated user
      },
      include: {
        collection: {
          select: {
            id: true, // Include only the collection ID
            name: true, // Include only the collection name
          },
        },
      },
    });

    // 4. If no entry is found, throw an error
    if (!entry) throw new Error("Entry not found");

    // 5. Return the fetched entry
    return entry;
  } catch (error) {
    // Log and rethrow the error
    console.error('Error fetching journal entry:', error.message);
    throw new Error(error.message);
  }
}

export async function updateJournalEntry(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Checking if entry exists and belongs to user
    const existingEntry = await db.entry.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!existingEntry) throw new Error("Entry not found");

    // Get mood data
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

    // Get new mood image if mood changed
    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id) {
      moodImageUrl = await getPixabayImage(data.moodQuery);
    }

    // Update the entry
    const updatedEntry = await db.entry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        collectionId: data.collectionId || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDraft() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function saveDraft(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.upsert({
      where: { userId: user.id },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}