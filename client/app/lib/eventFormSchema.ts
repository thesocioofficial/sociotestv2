import { z } from "zod";

const MAX_FILE_SIZE_BANNER = 2 * 1024 * 1024; // 2MB
const MAX_FILE_SIZE_IMAGE = 3 * 1024 * 1024; // 3MB
const MAX_FILE_SIZE_PDF = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const fileSchema = (
  maxSize: number,
  types: string[],
  isRequired: boolean = true
) =>
  z
    .custom<FileList>()
    .transform((files) => (files && files.length > 0 ? files[0] : null))
    .superRefine((file, ctx) => {
      if (isRequired && !file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File is required.",
        });
        return;
      }
      if (file) {
        if (file.size > maxSize) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            maximum: maxSize,
            type: "array",
            inclusive: true,
            message: `Max file size is ${maxSize / (1024 * 1024)}MB.`,
          });
        }
        if (!types.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unsupported file type. Accepted: ${types.join(", ")}`,
          });
        }
      }
    })
    .nullable();

export const scheduleItemSchema = z.object({
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  activity: z.string().min(1, "Activity is required").max(200, "Max 200 chars"),
});

export const eventFormSchema = z
  .object({
    eventTitle: z
      .string()
      .min(1, "Event title is required")
      .max(100, "Max 100 chars"),
    eventDate: z.string().min(1, "Event date is required"),
    eventTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)"
      ),
    endDate: z.string().min(1, "End date is required"),
    detailedDescription: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Max 1000 chars"),
    department: z
      .array(z.string())
      .min(1, "At least one department is required"),
    organizingDept: z.string().min(1, "Organizing department is required"),
    category: z.string().min(1, "Category is required"),
    festEvent: z.string().optional(),
    registrationDeadline: z.string().min(1, "Deadline is required"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(200, "Max 200 chars"),
    registrationFee: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d+(\.\d{1,2})?$/.test(val) || val === "0",
        "Invalid fee format. Enter a number (e.g., 0, 50, 100.50)"
      )
      .transform((val) => (val === "" ? undefined : val)),
    maxParticipants: z
      .string()
      .optional()
      .refine(
        (val) => !val || (Number(val) > 0 && Number.isInteger(Number(val))),
        "Must be a positive integer"
      )
      .transform((val) => (val === "" ? undefined : val)),
    contactEmail: z
      .string()
      .email("Invalid email format")
      .min(1, "Contact email is required"),
    contactPhone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    whatsappLink: z.string().url("Invalid URL").optional().or(z.literal("")),
    provideClaims: z.boolean().default(false),

    imageFile: fileSchema(
      MAX_FILE_SIZE_IMAGE,
      ACCEPTED_IMAGE_TYPES,
      false
    ).nullable(),
    bannerFile: fileSchema(
      MAX_FILE_SIZE_BANNER,
      ACCEPTED_IMAGE_TYPES,
      false
    ).nullable(),
    pdfFile: fileSchema(
      MAX_FILE_SIZE_PDF,
      ACCEPTED_PDF_TYPES,
      false
    ).nullable(),

    rules: z
      .array(
        z.object({
          value: z.string().min(1, "Rule cannot be empty"),
        })
      )
      .optional(),
    prizes: z
      .array(
        z.object({
          value: z.string().min(1, "Prize cannot be empty"),
        })
      )
      .optional(),

    scheduleItems: z.array(scheduleItemSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.eventDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.eventDate);
      }
      return true;
    },
    {
      message: "End date cannot be before event date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.eventDate && data.registrationDeadline) {
        return new Date(data.eventDate) >= new Date(data.registrationDeadline);
      }
      return true;
    },
    {
      message: "Registration deadline cannot be after event date",
      path: ["registrationDeadline"],
    }
  );

export type EventFormData = z.infer<typeof eventFormSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;

export const departments = [
  {
    value: "all_departments",
    label: "All Departments",
  },
  {
    value: "dept_english_cultural_studies",
    label: "Department of English and Cultural Studies",
  },
  { value: "dept_languages", label: "Department of Languages" },
  { value: "dept_media_studies", label: "Department of Media Studies" },
  {
    value: "dept_performing_arts_theatre_music",
    label: "Department of Performing Arts, Theatre Studies and Music",
  },
  {
    value: "dept_philosophy_theology",
    label: "Department of Philosophy and Theology",
  },
  {
    value: "dept_business_management",
    label: "Department of Business and Management",
  },
  { value: "dept_hotel_management", label: "Department of Hotel Management" },
  {
    value: "dept_tourism_management",
    label: "Department of Tourism Management",
  },
  { value: "dept_commerce", label: "Department of Commerce" },
  {
    value: "dept_professional_studies",
    label: "Department of Professional Studies",
  },
  { value: "dept_civil_engineering", label: "Department of Civil Engineering" },
  {
    value: "dept_computer_science_engineering",
    label: "Department of Computer Science and Engineering",
  },
  {
    value: "dept_electrical_electronics_engineering",
    label: "Department of Electrical and Electronics Engineering",
  },
  {
    value: "dept_electronics_communication_engineering",
    label: "Department of Electronics and Communication Engineering",
  },
  {
    value: "dept_mechanical_automobile_engineering",
    label: "Department of Mechanical and Automobile Engineering",
  },
  {
    value: "dept_sciences_humanities_eng",
    label: "Department of Sciences and Humanities",
  },
  {
    value: "dept_computer_science_sci",
    label: "Department of Computer Science",
  },
  { value: "dept_chemistry", label: "Department of Chemistry" },
  { value: "dept_life_sciences", label: "Department of Life Sciences" },
  { value: "dept_mathematics", label: "Department of Mathematics" },
  {
    value: "dept_physics_electronics",
    label: "Department of Physics and Electronics",
  },
  {
    value: "dept_statistics_data_science",
    label: "Department of Statistics and Data Science",
  },
  { value: "dept_economics", label: "Department of Economics" },
  {
    value: "dept_international_studies_political_science_history",
    label:
      "Department of International Studies, Political Science, and History",
  },
  {
    value: "dept_sociology_social_work",
    label: "Department of Sociology and Social Work",
  },
  { value: "dept_liberal_arts", label: "Department of Liberal Arts" },
];

export const categories = [
  { value: "academic", label: "Academic" },
  { value: "cultural", label: "Cultural" },
  { value: "sports", label: "Sports" },
  { value: "arts", label: "Arts" },
  { value: "literary", label: "Literary" },
  { value: "innovation", label: "Innovation" },
];

let res;
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fests`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  res = await response.json();
} catch (error) {
  console.error("There was a problem with the fetch operation:", error);
}

export const festEvents =
  res?.fests?.map((fest: any) => ({
    value: fest.fest_title,
    label: fest.fest_title,
  })) || [];
