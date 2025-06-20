"use server"
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, ENDPOINT } from "../appwrite.config"
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"

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

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // const scheduledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "scheduled");

    // const pendingAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "pending");

    // const cancelledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "cancelled");

    // const data = {
    //   totalCount: appointments.total,
    //   scheduledCount: scheduledAppointments.length,
    //   pendingCount: pendingAppointments.length,
    //   cancelledCount: cancelledAppointments.length,
    //   documents: appointments.documents,
    // };

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};
