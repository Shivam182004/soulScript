'use client'

import { deleteCollection } from '@/action/collection';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import useFetch from '@/hooks/useFetch';


const DeleteCollectionDialog = (  {collection,
    entriesCount = 0}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
  
    const {
      loading: isDeleting,
      fn: deleteCollectionFn,
      data: deletedCollection,
    } = useFetch(deleteCollection);
  
    useEffect(() => {
      if (deletedCollection && !isDeleting) {
        setOpen(false);
        toast.error(
          `Collection "${collection.name}" and all its entries deleted`
        );
        router.push("/dashboard");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletedCollection, isDeleting]);
  
    const handleDelete = async () => {
      console.log("Attempting to delete collection with ID:", collection.id);
      await deleteCollectionFn(collection.id);
    };

    // console.log(collection.id)
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" size="sm">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete &quot;{collection.name}&quot;?
        </AlertDialogTitle>
        <div className="space-y-2 text-muted-foreground text-sm">
         
          <p>This will permanently delete:</p>
          <ul className="list-disc list-inside">
            <li>The collection &quot;{collection.name}&quot;</li>
            <li>
              {entriesCount} journal{" "}
              {entriesCount === 1 ? "entry" : "entries"}
            </li>
          </ul>
          <p className="font-semibold text-red-600">
            This action cannot be undone.
          </p>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Collection"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}



export default DeleteCollectionDialog