


import { getCollections } from '@/action/collection'
import { getJournalEntries } from '@/action/journal';
import React from 'react'
import Collections from './_components/Collections';
import MoodAnalytics from './_components/moodAnalytics';

const Dashboard = async () => {

  const collections = await getCollections();
  const entriesData = await getJournalEntries();

//grouping the collections
  const entriesByCollection = entriesData?.data?.entries?.reduce(
    (acc, entry) => {
      const collectionId = entry.collectionId || "unorganized";
      if (!acc[collectionId]) {
        acc[collectionId] = [];
      }
      acc[collectionId].push(entry);
      return acc;
    },
    {}
  );
  
  
  return (
    <div className="px-4 py-8 space-y-8">
    {/* analytics section for the dashboard */}
       <section className="space-y-4">
       <MoodAnalytics/>
      
      </section>

      <Collections
        collections={collections}
        entriesByCollection={entriesByCollection}
      />
       
    
    </div>
  )
}

export default Dashboard