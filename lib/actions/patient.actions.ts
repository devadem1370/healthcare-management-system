"use server";

import { ID, Query } from "node-appwrite";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import {InputFile} from 'node-appwrite/file'
// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};


export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);

    } catch (error) {
        console.log(error);
    }
}


export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Ensure required environment variables are defined
    if (!DATABASE_ID) {
      throw new Error("DATABASE_ID is undefined. Please check your environment variables.");
    }

    if (!PATIENT_COLLECTION_ID) {
      throw new Error("PATIENT_COLLECTION_ID is undefined. Please check your environment variables.");
    }

    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      if (!BUCKET_ID) {
        throw new Error("BUCKET_ID is undefined. Please check your environment variables.");
      }

      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string
      )
      file = await storage.createFile(BUCKET_ID, ID.unique(), inputFile)
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw error;
  }
};


export const getPatient = async (userId: string) => {
    try {
        // Ensure required environment variables are defined
        if (!DATABASE_ID) {
            throw new Error("DATABASE_ID is undefined. Please check your environment variables.");
        }

        if (!PATIENT_COLLECTION_ID) {
            throw new Error("PATIENT_COLLECTION_ID is undefined. Please check your environment variables.");
        }

        const patients = await databases.listDocuments(
            DATABASE_ID,
            PATIENT_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );

        return parseStringify(patients.documents[0]);

    } catch (error) {
        console.error("Error getting patient:", error);
        throw error;
    }
}
