"use client";
import React, { useState } from "react";
import EventForm from "@/app/_components/Admin/ManageEvent";
import { EventFormData } from "@/app/lib/eventFormSchema";
import { SubmitHandler } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleCreateEvent: SubmitHandler<EventFormData> = async (
    dataFromHookForm
  ) => {
    console.log(
      "CreateEventPage: handleCreateEvent CALLED. Data:",
      JSON.stringify(dataFromHookForm, null, 2)
    );

    setIsSubmitting(true);

    let token;
    try {
      console.log("CreateEventPage: Attempting to get session...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error(
          "CreateEventPage: Session error or no session.",
          sessionError
        );
        alert("Authentication error or no active session. Please log in.");
        setIsSubmitting(false);
        throw new Error(sessionError?.message || "User not authenticated.");
      }
      token = session.access_token;
      console.log("CreateEventPage: Session obtained, token acquired.");
    } catch (e: any) {
      console.error("CreateEventPage: Unexpected error getting session:", e);
      alert(
        e.message ||
          "An unexpected error occurred while verifying your session."
      );
      setIsSubmitting(false);
      throw e;
    }

    const formData = new FormData();

    const appendIfExists = (key: string, value: any) => {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        formData.append(key, String(value));
      }
    };

    const appendJsonArrayOrObject = (key: string, value: any) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length > 0
      ) {
        formData.append(key, JSON.stringify(value));
      }
    };

    appendIfExists("eventTitle", dataFromHookForm.eventTitle);
    appendIfExists("eventDate", dataFromHookForm.eventDate);
    appendIfExists("endDate", dataFromHookForm.endDate);
    appendIfExists("eventTime", dataFromHookForm.eventTime);
    appendIfExists("detailedDescription", dataFromHookForm.detailedDescription);

    appendIfExists("organizingDept", dataFromHookForm.organizingDept);

    appendJsonArrayOrObject("department", dataFromHookForm.department);

    appendIfExists("category", dataFromHookForm.category);
    appendIfExists("festEvent", dataFromHookForm.festEvent);
    appendIfExists(
      "registrationDeadline",
      dataFromHookForm.registrationDeadline
    );
    appendIfExists("location", dataFromHookForm.location);

    appendIfExists("registrationFee", dataFromHookForm.registrationFee);
    appendIfExists("maxParticipants", dataFromHookForm.maxParticipants);

    appendIfExists("contactEmail", dataFromHookForm.contactEmail);
    appendIfExists("contactPhone", dataFromHookForm.contactPhone);
    appendIfExists("whatsappLink", dataFromHookForm.whatsappLink);

    formData.append("provideClaims", String(dataFromHookForm.provideClaims));
    formData.append(
      "sendNotifications",
      String(dataFromHookForm.sendNotifications)
    );

    appendJsonArrayOrObject("scheduleItems", dataFromHookForm.scheduleItems);
    appendJsonArrayOrObject("rules", dataFromHookForm.rules);
    appendJsonArrayOrObject("prizes", dataFromHookForm.prizes);
    appendJsonArrayOrObject("eventHeads", dataFromHookForm.eventHeads);

    if (dataFromHookForm.imageFile instanceof File) {
      formData.append("imageFile", dataFromHookForm.imageFile);
    } else if (dataFromHookForm.imageFile) {
      console.warn(
        "CreateEventPage: imageFile is present but not a File object:",
        dataFromHookForm.imageFile
      );
    }
    if (dataFromHookForm.bannerFile instanceof File) {
      formData.append("bannerFile", dataFromHookForm.bannerFile);
    } else if (dataFromHookForm.bannerFile) {
      console.warn(
        "CreateEventPage: bannerFile is present but not a File object:",
        dataFromHookForm.bannerFile
      );
    }
    if (dataFromHookForm.pdfFile instanceof File) {
      formData.append("pdfFile", dataFromHookForm.pdfFile);
    } else if (dataFromHookForm.pdfFile) {
      console.warn(
        "CreateEventPage: pdfFile is present but not a File object:",
        dataFromHookForm.pdfFile
      );
    }

    console.log("CreateEventPage: FormData prepared. Content snapshot:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name}, Type - ${value.type}, Size - ${value.size} bytes`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log(`CreateEventPage: API_URL is: ${API_URL}`);

    try {
      console.log(`CreateEventPage: Initiating fetch to ${API_URL}/api/events`);
      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(
        "CreateEventPage: Fetch responded. Status:",
        response.status,
        "Ok:",
        response.ok
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          const responseText = await response.text();
          console.error(
            "CreateEventPage: Failed to parse error response JSON. Raw text:",
            responseText
          );
          errorData = {
            error: "Failed to parse error response from server.",
            details: `Status: ${response.status}, StatusText: ${response.statusText}. Response body: ${responseText}`,
          };
        }
        console.error("CreateEventPage: API Error Data:", errorData);
        const message =
          errorData.error ||
          errorData.message ||
          (typeof errorData.details === "string" ? errorData.details : null) ||
          errorData.detail ||
          `Server error: ${response.status} ${response.statusText}`;
        throw new Error(message);
      }

      const result = await response.json();
      console.log(
        "CreateEventPage: Event created successfully via API:",
        result
      );
    } catch (error: any) {
      console.error(
        "CreateEventPage: Error during event creation fetch/processing:",
        error.message,
        error
      );
      alert(
        `Failed to create event. ${
          error?.message || "An unknown error occurred."
        }`
      );
      throw error;
    } finally {
      console.log("CreateEventPage: handleCreateEvent FINALLY block.");
      setIsSubmitting(false);
    }
  };

  return (
    <EventForm
      onSubmit={handleCreateEvent}
      isSubmittingProp={isSubmitting}
      isEditMode={false}
      existingImageFileUrl={null}
      existingBannerFileUrl={null}
      existingPdfFileUrl={null}
    />
  );
}
