// Note 1: Constants are centralized here instead of being scattered across
// components. Using "as const" on objects makes TypeScript treat all values
// as literal types (not just "string" or "number"), enabling better type
// inference and preventing accidental mutation.

// Note 2: Time constraints enforce OJT policy rules at the application level.
// These values are referenced by both the Zod validation schema (compile-time)
// and the QuickLogForm UI (display-time), ensuring consistency.
export const TIME_CONSTRAINTS = {
  // Note 3: MIN_TIME and MAX_TIME define the allowed window for OJT activities.
  // 7:00 AM to 9:00 PM covers standard business hours plus overtime.
  MIN_TIME: "07:00",
  MAX_TIME: "21:00",
  // Note 4: MAX_HOURS_PER_DAY prevents data entry errors. A student can't
  // reasonably log more than 12 hours in a single day, so this catches typos
  // (e.g., accidentally entering "08:00 AM to 08:00 AM" which would be 24 hours).
  MAX_HOURS_PER_DAY: 12,
} as const

// Note 5: Smart defaults pre-fill the time pickers to reduce manual input.
// The morning session (8AM-12PM) and afternoon session (1PM-5PM) are the
// standard SJPIICD OJT schedule. When a student selects "Morning" as their
// session type, the form auto-fills these times — saving about 4 taps.
export const SMART_DEFAULTS = {
  MORNING: { time_in: "08:00", time_out: "12:00" },
  AFTERNOON: { time_in: "13:00", time_out: "17:00" },
} as const

// Note 6: Target hours are NOT hardcoded per program because:
// 1. Different courses have different CHED requirements
// 2. Some courses have 2 separate OJT periods (e.g., 200h + 200h)
// 3. Requirements may change per academic year
// Instead, students set their own target_hours after first login.
// This value is stored in the users.target_hours column in Supabase.

// Curated list of companies/organizations commonly hosting OJT students
// in Davao City. Using a predefined list ensures data consistency
// (e.g., "DOST" vs "Department of Science and Technology" — same org).
// Students can still type a custom name not in this list.
export const DAVAO_COMPANIES = [
  "2TG Manpower Int'l Corp.",
  "Abartes Trading Inc.",
  "Accenture",
  "Aeon Credit Service Philippines",
  "Allado",
  "Alsons Development and Investment Corporation",
  "Amalgamated Group of Companies",
  "AMREP Digital Photograph Processing",
  "Arkons A.P.O. Philippine Corp.",
  "Awesome OS – MTS",
  "BDO Unibank",
  "BPI (Bank of the Philippine Islands)",
  "Bureau of Internal Revenue (BIR)",
  "Callbox Inc. Davao",
  "Camp Sgt. Quintin M. Merecido Hospital (CSQMMH)",
  "CEL Logistics",
  "City Government of Davao",
  "City Transport and Traffic Management Office (CTTMO)",
  "Columbia Computer Center",
  "Commission on Audit (COA)",
  "Concentrix Davao",
  "Converge ICT Solutions (Surf2Sawa)",
  "Davao Adventist Hospital",
  "Davao City Tourism Operations Office",
  "Davao City Water District (DCWD)",
  "Davao City Water District (DCWD) - Matina",
  "Davao Light and Power Company",
  "Department of Agrarian Reform",
  "Department of Education (DepEd)",
  "Department of Energy (Mindanao Field Office)",
  "Department of Health (DOH)",
  "Department of Information and Communications Technology (DICT)",
  "Department of Science and Technology (DOST)",
  "Department of Social Welfare and Development (DSWD)",
  "Department of Trade and Industry (DTI)",
  "DICT Region XI",
  "Digital Interface, Inc.",
  "DOLE (Department of Labor and Employment)",
  "Domicilio Lorenzo Apartelle",
  "Domicilio Lorenzo Hotel",
  "DXGN 89.9 Spirit FM",
  "Envireau Pacific Inc. (EPI Phil.)",
  "Eversun Software Corporation",
  "Full Potential Solutions",
  "Galaxy Credit Cooperative",
  "Globe Telecom",
  "Graphix One Digital Marketing Corporation",
  "Hijo Resources Corporation",
  "Holcim Philippines - Davao",
  "IBEX Global Solutions, Philippines Inc.",
  "Joyo Marketing - Davao",
  "JTC Group of Companies",
  "Kolin Davao Service Center",
  "Land Bank of the Philippines",
  "Land Registration Authority – Registry of Deeds",
  "Land Transportation Office (LTO)",
  "Land Transportation Office (LTO) - Felcris Centrale",
  "Levic Real Estate",
  "Links Healthcare",
  "Logimine",
  "LTFRB",
  "LTS Retail Specialists, Inc. (NCCC Group)",
  "Metropolitan Bank and Trust Company (Metrobank)",
  "Mitsumi Philippines",
  "Mustard Seed Systems Corporation",
  "National Bureau of Investigation (NBI)",
  "National Irrigation Administration (NIA) Region XI",
  "National Telecommunications Commission (NTC)",
  "Next BPO Solutions",
  "Open Access BPO",
  "Overseas Workers Welfare Administration (OWWA)",
  "P.L. Sebastian Construction Company Inc.",
  "Penong's Franchise Corporation",
  "Peoples Land Corporation",
  "PhilHealth",
  "Philippine Information Agency (PIA) Region XI",
  "Philippine National Police (PNP)",
  "Philippine Postal Corporation - Mintal",
  "Philippine Postal Corporation - Roxas",
  "Philippine Statistics Authority (PSA)",
  "Phoenix Petroleum Philippines, Inc.",
  "PLDT / Smart Communications",
  "Purge Coffee Roaster",
  "QFC Davao Ink and Toner Station",
  "Radio Philippines Network, Inc. (RPN)",
  "RMS Collect Philippines",
  "RMT Realty OPC",
  "Sangguniang Panglungsod",
  "Sasuman Ang Training Corporation",
  "Six Eleven Global Services",
  "Social Security System (SSS)",
  "St. John Paul II College of Davao",
  "Technical Education and Skills Development Authority (TESDA)",
  "Teleperformance Davao",
  "The Launchpad Inc.",
  "University of Southeastern Philippines (USeP)",
  "UP Mindanao",
  "Venado Property Development Corporation",
  "Vice Mayor's Office",
  "VXI – Dacudao",
  "VXI – Felcris Centrale",
  "VXI – Robinson's Cybergate",
  "VXI – SM Ecoland",
  "VXI Global Solutions Davao",
] as const
