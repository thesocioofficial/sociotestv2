"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useEvents,
  FetchedEvent as ContextFetchedEvent,
} from "../../../context/EventContext";
import { useAuth } from "../../../context/AuthContext";
import moment from "moment";

interface EventData {
  id: string;
  title: string;
  department: string;
  tags?: string[];
  date: string;
  endDate: string;
  location: string;
  price: string;
  numTeammates: number;
  daysLeft: number;
  description: string;
  rules?: string[];
  schedule?: Array<{ time: string; activity: string }>;
  prizes?: string[];
  image: string;
  pdf?: string;
  organizers?: Array<{ name: string; email: string; phone: string }>;
  whatsappLink?: string;
  registrationDeadlineISO?: string | null;
}

export default function Page() {
  const params = useParams();
  const eventIdSlug = params.id;
  const router = useRouter();

  const {
    allEvents,
    isLoading: contextIsLoading,
    error: contextError,
  } = useEvents();
  const { userData, isLoading: authIsLoading } = useAuth();

  const detailsRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const prizesRef = useRef<HTMLDivElement>(null);

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationApiError, setRegistrationApiError] = useState<
    string | null
  >(null);

  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState<
    string[]
  >([]);
  const [loadingUserRegistrations, setLoadingUserRegistrations] =
    useState(false);

  const isUserRegisteredForThisEvent = eventData
    ? userRegisteredEventIds.includes(eventData.id)
    : false;
  const isDeadlineOverForThisEvent = eventData
    ? eventData.daysLeft <= 0
    : false;

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let currentEventIdString: string | undefined;
    if (Array.isArray(eventIdSlug)) {
      currentEventIdString = eventIdSlug[0];
    } else if (typeof eventIdSlug === "string") {
      currentEventIdString = eventIdSlug;
    }

    if (contextIsLoading) {
      setPageLoading(true);
      return;
    }

    if (contextError) {
      setPageError(contextError);
      setEventData(null);
      setPageLoading(false);
      return;
    }

    if (!currentEventIdString) {
      setPageError("Event ID not found in URL.");
      setEventData(null);
      setPageLoading(false);
      return;
    }

    const foundEvent = allEvents.find(
      (event: ContextFetchedEvent) => event.event_id === currentEventIdString
    );

    if (foundEvent) {
      let processedRules: string[] | undefined = undefined;
      if (
        foundEvent.rules &&
        Array.isArray(foundEvent.rules) &&
        foundEvent.rules.length > 0
      ) {
        const firstRule = foundEvent.rules[0];
        if (typeof firstRule === "string") {
          const rulesArray = foundEvent.rules.filter(
            (r): r is string => typeof r === "string" && r.trim() !== ""
          );
          if (rulesArray.length > 0) processedRules = rulesArray;
        } else if (
          typeof firstRule === "object" &&
          firstRule !== null &&
          "value" in firstRule &&
          typeof firstRule.value === "string"
        ) {
          const rulesArray = (foundEvent.rules as { value: string }[])
            .map((r) => r.value)
            .filter(
              (r_val): r_val is string =>
                typeof r_val === "string" && r_val.trim() !== ""
            );
          if (rulesArray.length > 0) processedRules = rulesArray;
        }
      }

      let processedSchedule:
        | Array<{ time: string; activity: string }>
        | undefined = undefined;
      if (
        foundEvent.schedule &&
        Array.isArray(foundEvent.schedule) &&
        foundEvent.schedule.length > 0
      ) {
        const validScheduleItems = foundEvent.schedule.filter(
          (s): s is { time: string; activity: string } =>
            typeof s === "object" &&
            s !== null &&
            typeof s.time === "string" &&
            s.time.trim() !== "" &&
            typeof s.activity === "string" &&
            s.activity.trim() !== ""
        );
        if (validScheduleItems.length > 0) {
          processedSchedule = validScheduleItems;
        }
      }

      let processedPrizes: string[] | undefined = undefined;
      if (
        foundEvent.prizes &&
        Array.isArray(foundEvent.prizes) &&
        foundEvent.prizes.length > 0
      ) {
        const firstPrize = foundEvent.prizes[0];
        if (typeof firstPrize === "string") {
          const prizesArray = foundEvent.prizes.filter(
            (p): p is string => typeof p === "string" && p.trim() !== ""
          );
          if (prizesArray.length > 0) processedPrizes = prizesArray;
        } else if (
          typeof firstPrize === "object" &&
          firstPrize !== null &&
          "value" in (firstPrize as { value?: unknown }) &&
          typeof (firstPrize as { value?: unknown }).value === "string"
        ) {
          const prizesArray = (
            foundEvent.prizes as unknown as Array<{ value: string }>
          )
            .map((p) => p.value)
            .filter(
              (p_val): p_val is string =>
                typeof p_val === "string" && p_val.trim() !== ""
            );
          if (prizesArray.length > 0) processedPrizes = prizesArray;
        }
      }

      const transformedOrganizers: Array<{
        name: string;
        email: string;
        phone: string;
      }> = [
        {
          name: foundEvent.organizer_email
            ? "Event Coordination Team"
            : "Coordinator Team",
          email: foundEvent.organizer_email || "info@example.com",
          phone:
            foundEvent.organizer_phone !== undefined &&
            foundEvent.organizer_phone !== null
              ? String(foundEvent.organizer_phone)
              : "N/A",
        },
      ];

      const finalEventData: EventData = {
        id: foundEvent.event_id,
        title: foundEvent.title || "Untitled Event",
        department: foundEvent.organizing_dept || "General",
        tags: [
          ...(foundEvent.fest && foundEvent.fest !== "none"
            ? [foundEvent.fest]
            : []),
          ...(foundEvent.category ? [foundEvent.category] : []),
        ].filter(
          (tag): tag is string => tag != null && String(tag).trim() !== ""
        ),
        date: foundEvent.event_date
          ? moment(foundEvent.event_date).format("MMM D, YYYY")
          : "Date TBD",
        endDate: foundEvent.end_date
          ? moment(foundEvent.end_date).format("MMM D, YYYY")
          : foundEvent.event_date
          ? moment(foundEvent.event_date).format("MMM D, YYYY")
          : "Date TBD",
        location: foundEvent.venue || "Location TBD",
        price:
          foundEvent.registration_fee != null && foundEvent.registration_fee > 0
            ? `₹${foundEvent.registration_fee}`
            : "Free",
        numTeammates: foundEvent.participants_per_team ?? 1,
        daysLeft: (() => {
          if (!foundEvent.registration_deadline) return 0;
          const target = moment(foundEvent.registration_deadline);
          const today = moment().startOf("day");
          if (target.isBefore(today)) return 0;
          return target.diff(today, "days");
        })(),
        description: foundEvent.description || "No description available.",
        rules: processedRules,
        schedule: processedSchedule,
        prizes: processedPrizes,
        image:
          foundEvent.banner_url ||
          foundEvent.event_image_url ||
          "https://via.placeholder.com/1200x600?text=Event+Image",
        pdf: foundEvent.pdf_url || undefined,
        organizers:
          transformedOrganizers.length > 0 ? transformedOrganizers : undefined,
        whatsappLink: foundEvent.whatsapp_invite_link || undefined,
        registrationDeadlineISO: foundEvent.registration_deadline,
      };
      setEventData(finalEventData);
      setPageError(null);
    } else {
      if (currentEventIdString) {
        setPageError(`Event with ID "${currentEventIdString}" not found.`);
      }
      setEventData(null);
    }
    setPageLoading(false);
  }, [eventIdSlug, allEvents, contextIsLoading, contextError]);

  useEffect(() => {
    if (userData && userData.register_number && !authIsLoading) {
      setLoadingUserRegistrations(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${userData.register_number}`
      )
        .then((res) =>
          res.ok ? res.json() : Promise.resolve({ registeredEventIds: [] })
        )
        .then((data) =>
          setUserRegisteredEventIds(data.registeredEventIds || [])
        )
        .catch(() => setUserRegisteredEventIds([]))
        .finally(() => setLoadingUserRegistrations(false));
    } else if (!authIsLoading && !userData) {
      setUserRegisteredEventIds([]);
      setLoadingUserRegistrations(false);
    }
  }, [userData, authIsLoading]);

  const handleRegistration = async () => {
    if (
      !eventData ||
      isUserRegisteredForThisEvent ||
      isDeadlineOverForThisEvent
    )
      return;
    setRegistrationApiError(null);

    if (eventData.numTeammates <= 1) {
      if (authIsLoading) {
        setRegistrationApiError("Verifying user data, please wait...");
        return;
      }
      if (!userData || userData.register_number == null) {
        setRegistrationApiError(
          "User profile incomplete or not logged in. Registration number is required."
        );
        return;
      }
      const regNumStr = String(userData.register_number);
      if (!/^\d{7}$/.test(regNumStr)) {
        setRegistrationApiError(
          "Invalid registration number in your profile. It must be 7 digits."
        );
        return;
      }

      setIsRegistering(true);
      try {
        const payload = {
          eventId: eventData.id,
          teamName: null,
          teammates: [{ registerNumber: regNumStr }],
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setShowSuccessModal(true);
          setUserRegisteredEventIds((prev) => [...prev, eventData.id]);
        } else {
          const errorData = await response.json();
          setRegistrationApiError(
            errorData.error ||
              errorData.message ||
              "Registration failed. Please try again."
          );
        }
      } catch (error) {
        setRegistrationApiError(
          "An unexpected network error occurred. Please check your connection and try again."
        );
      } finally {
        setIsRegistering(false);
      }
    } else {
      router.push(`/event/${eventData.id}/register`);
    }
  };

  const isIndividualEventForButton =
    eventData?.numTeammates !== undefined && eventData.numTeammates <= 1;

  const getButtonTextAndProps = () => {
    if (authIsLoading || loadingUserRegistrations)
      return { text: "Loading...", disabled: true };
    if (isUserRegisteredForThisEvent)
      return { text: "Registered", disabled: true };
    if (isDeadlineOverForThisEvent)
      return { text: "Registrations closed", disabled: true };
    if (isRegistering)
      return {
        text: (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Registering...
          </span>
        ),
        disabled: true,
      };
    return { text: "Register", disabled: false };
  };
  const buttonState = getButtonTextAndProps();

  if (pageLoading || (authIsLoading && !eventData)) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-8 animate-spin text-[#063168]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    );
  }

  if (pageError || !eventData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 text-red-500 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
          Oops! Something went wrong.
        </p>
        <p className="text-md sm:text-lg font-medium text-gray-500">
          {pageError || "Could not load event details."}
        </p>
        <Link
          href="/"
          className="mt-6 bg-[#063168] text-white py-2 px-6 rounded-full font-medium hover:bg-[#154CB3] transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  if (showSuccessModal) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border-2 border-gray-200 text-center max-w-md w-full">
          <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#063168] mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully registered for {eventData.title}.
          </p>
          <div className="flex flex-col sm:flex-row justify-around gap-4">
            <button
              onClick={() => router.push("/discover")}
              className="bg-[#154CB3] cursor-pointer text-white py-2 px-6 rounded-full font-medium hover:bg-[#154cb3eb] transition-colors"
            >
              Back to discover
            </button>
            {eventData.whatsappLink && (
              <a
                href={eventData.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-200 text-green-600 py-2 px-6 rounded-full font-medium hover:bg-green-300 transition-colors flex items-center justify-center gap-2"
              >
                Join Whatsapp Group
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative w-full h-[30vh] sm:h-[45vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: eventData.image
            ? `url('${eventData.image}')`
            : "none",
        }}
      >
        <div
          className="absolute inset-0 z-[1]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        ></div>
        <div className="absolute inset-0 flex flex-col-reverse sm:flex-row justify-between p-4 sm:p-10 sm:px-12 items-end z-[2]">
          <div className="flex flex-col w-full sm:w-auto mt-4 sm:mt-0 sm:text-left">
            {eventData.tags && eventData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 items-center sm:justify-start">
                {(eventData.tags || []).map((tag, index) => {
                  const titleTag = tag
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ");

                  return (
                    <p
                      key={index}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        index % 2 === 0
                          ? "bg-[#FFCC00] text-black"
                          : "bg-[#063168] text-white"
                      }`}
                    >
                      {titleTag}
                    </p>
                  );
                })}
              </div>
            )}
            <h1 className="text-[1.3rem] sm:text-[2.1rem] font-bold text-white m-0">
              {eventData.title}
            </h1>
            <p className="text-base sm:text-lg font-medium text-gray-200">
              {eventData.department}
            </p>
          </div>
          {!isDeadlineOverForThisEvent ? (
            <div className="flex flex-col items-center bg-gradient-to-b from-[#FFCC00] to-[#FFE88D] rounded-xl border-2 border-[#FFCC0080] py-3 px-3 sm:px-4 sm:py-5 mb-4 sm:mb-0">
              <p className="text-3xl sm:text-5xl font-bold m-0 text-black">
                {eventData.daysLeft}
              </p>
              <p className="text-sm sm:text-base font-medium text-black">
                {eventData.daysLeft === 1 ? "day left" : "days left"}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row flex-wrap px-4 sm:px-8 gap-4 sm:gap-8 text-gray-500 font-medium items-center bg-[#F5F5F5] h-auto sm:h-[10vh] m-4 sm:m-10 rounded-xl border-2 border-[#E0E0E0] py-4 sm:py-0">
        <p
          className="text-[#063168] cursor-pointer transition-colors text-sm sm:text-base"
          onClick={() => scrollToSection(detailsRef)}
        >
          Details
        </p>
        {eventData.rules && eventData.rules.length > 0 && (
          <p
            className="cursor-pointer hover:text-[#063168] transition-colors text-sm sm:text-base"
            onClick={() => scrollToSection(rulesRef)}
          >
            Rules and guidelines
          </p>
        )}
        {eventData.schedule && eventData.schedule.length > 0 && (
          <p
            className="cursor-pointer hover:text-[#063168] transition-colors text-sm sm:text-base"
            onClick={() => scrollToSection(scheduleRef)}
          >
            Schedule
          </p>
        )}
        {eventData.prizes && eventData.prizes.length > 0 && (
          <p
            className="cursor-pointer hover:text-[#063168] transition-colors text-sm sm:text-base"
            onClick={() => scrollToSection(prizesRef)}
          >
            Prizes
          </p>
        )}
        <div className="ml-auto flex flex-col items-end">
          <button
            onClick={handleRegistration}
            disabled={buttonState.disabled}
            className="bg-[#154CB3] cursor-pointer text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#154cb3eb] transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {buttonState.text}
          </button>
          {registrationApiError &&
            isIndividualEventForButton &&
            !isUserRegisteredForThisEvent &&
            !isDeadlineOverForThisEvent && (
              <p className="text-red-500 text-xs mt-1 text-right max-w-xs">
                {registrationApiError}
              </p>
            )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-10 my-6 md:my-10">
        <div className="flex-1">
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-[#F5F5F5] p-4 md:p-6">
              <h2 className="text-xl font-semibold text-[#063168]">
                Event Details
              </h2>
            </div>
            <div
              ref={detailsRef}
              className="flex flex-col p-4 md:p-6 scroll-mt-24"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3">
                  <CalendarIcon />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-800 font-medium">
                      {eventData.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon />
                  <div>
                    <p className="text-sm text-gray-500">End date</p>
                    <p className="text-gray-800 font-medium">
                      {eventData.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LocationIcon />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800 font-medium">
                      {eventData.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TicketIcon />
                  <div>
                    <p className="text-sm text-gray-500">Registration Fee</p>
                    <p className="text-gray-800 font-medium">
                      {eventData.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UsersIcon />
                  <div>
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="text-gray-800 font-medium">
                      {eventData.numTeammates <= 1
                        ? "Individual Event"
                        : `Team Event (Up to ${eventData.numTeammates} members)`}
                    </p>
                  </div>
                </div>
                {eventData.pdf && (
                  <div className="flex items-center gap-3">
                    <DocumentIcon />
                    <div>
                      <p className="text-sm text-gray-500">Event Brochure</p>
                      <a
                        href={eventData.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#154CB3] hover:text-[#063168] hover:underline flex items-center font-medium"
                      >
                        Download PDF
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 ml-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {eventData.description && (
                <div className="mt-6 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <h3 className="text-lg font-medium text-[#063168] mb-2">
                    About this event
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {eventData.description}
                  </p>
                </div>
              )}
              {eventData.organizers && eventData.organizers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col w-full">
                  <h3 className="text-lg font-medium text-[#063168] mb-4">
                    Organizers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {eventData.organizers.map((organizer, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-md border border-gray-200 "
                      >
                        <p className="font-semibold text-gray-800 text-md mb-1">
                          {organizer.name}
                        </p>
                        {organizer.email && organizer.email !== "N/A" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <EnvelopeSmallIcon />
                            <a
                              href={`mailto:${organizer.email}`}
                              className="hover:underline break-all"
                            >
                              {organizer.email}
                            </a>
                          </div>
                        )}
                        {organizer.phone && organizer.phone !== "N/A" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <PhoneSmallIcon />
                            <a
                              href={`tel:${organizer.phone}`}
                              className="hover:underline"
                            >
                              {organizer.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {eventData.rules && eventData.rules.length > 0 && (
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-6">
              <div className="border-b border-gray-200 bg-[#F5F5F5] p-4 md:p-6">
                <h2 className="text-xl font-semibold text-[#063168]">
                  Rules & Guidelines
                </h2>
              </div>
              <div ref={rulesRef} className="p-4 md:p-6 scroll-mt-24">
                <ul className="space-y-3 list-disc list-inside marker:text-[#063168]">
                  {eventData.rules.map((rule, index) => (
                    <li key={index} className="text-gray-700">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {eventData.schedule && eventData.schedule.length > 0 && (
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-6">
              <div className="border-b border-gray-200 bg-[#F5F5F5] p-4 md:p-6">
                <h2 className="text-xl font-semibold text-[#063168]">
                  Event Schedule
                </h2>
              </div>
              <div ref={scheduleRef} className="p-4 md:p-6 scroll-mt-24">
                <div>
                  {eventData.schedule.map((item, index) => (
                    <div key={index} className="flex gap-x-4">
                      <div
                        className={`relative ${
                          index === eventData.schedule!.length - 1
                            ? ""
                            : "after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-300"
                        }`}
                      >
                        <div className="relative z-10 w-7 h-7 flex justify-center items-center">
                          <div className="w-3 h-3 rounded-full bg-[#063168] border-2 border-white"></div>
                        </div>
                      </div>
                      <div className="grow pt-0 pb-8">
                        <p className="text-md font-semibold text-[#063168] -mt-1">
                          {item.activity}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {eventData.prizes && eventData.prizes.length > 0 && (
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-6 lg:mb-0">
              <div className="border-b border-gray-200 bg-[#F5F5F5] p-4 md:p-6">
                <h2 className="text-xl font-semibold text-[#063168]">
                  Prizes & Opportunities
                </h2>
              </div>
              <div ref={prizesRef} className="p-4 md:p-6 scroll-mt-24">
                <ul className="space-y-3">
                  {eventData.prizes.map((prize, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-[#FFCC00] flex-shrink-0 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                        />
                      </svg>
                      <p className="text-gray-700">{prize}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center pb-4">
            {registrationApiError &&
              isIndividualEventForButton &&
              !isUserRegisteredForThisEvent &&
              !isDeadlineOverForThisEvent && (
                <p className="text-red-500 text-sm mb-2 text-center px-4">
                  {registrationApiError}
                </p>
              )}
            <button
              onClick={handleRegistration}
              disabled={buttonState.disabled}
              className="bg-[#154CB3] cursor-pointer text-white py-3 px-8 rounded-full font-semibold hover:bg-[#154cb3eb] transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {buttonState.text === "Register" ? "Register" : buttonState.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5 text-[#063168] flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);
const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5 text-[#063168] flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0Z"
    />
  </svg>
);
const TicketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5 text-[#063168] flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
    />
  </svg>
);
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5 text-[#063168] flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0Zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0Zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0Z"
    />
  </svg>
);
const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5 text-[#063168] flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9Z"
    />
  </svg>
);
const EnvelopeSmallIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 text-gray-500 flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);
const PhoneSmallIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 text-gray-500 flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z"
    />
  </svg>
);
