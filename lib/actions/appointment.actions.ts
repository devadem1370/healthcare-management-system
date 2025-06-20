"use server"
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, ENDPOINT } from "../appwrite.config"
import { ID } from "node-appwrite"
import { parseStringify } from "../utils"

export const createAppointment = async(appointment: CreateAppointmentParams)=>{

    try {
        // Ensure DATABASE_ID is defined
        if (!DATABASE_ID) {
            throw new Error("DATABASE_ID is undefined. Please check your environment variables.");
        }

        // Ensure APPOINTMENT_COLLECTION_ID is defined
        if (!APPOINTMENT_COLLECTION_ID) {
            throw new Error("APPOINTMENT_COLLECTION_ID is undefined. Please check your environment variables.");
        }

        const newAppointment = await databases.createDocument(
            DATABASE_ID,
            APPOINTMENT_COLLECTION_ID,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment)
    } catch (error) {
        console.error("Error creating appointment:", error)
        throw error;
    }

}
