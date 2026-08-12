export type OwnerFactStatus = "confirmed" | "pending_owner_confirmation";

export type EducationFact = {
  stage: string;
  institution: string | null;
  status: OwnerFactStatus;
  note: string;
};

/**
 * Owner-controlled facts. Do not promote a pending fact to confirmed without a
 * written approval record from Dr. Haddad or the authorized site owner.
 */
export const DR_HADDAD_FACTS = {
  name: "Elie R. Haddad, MD",
  specialties: ["Cardiology", "Clinical cardiac electrophysiology"],
  educationStatus: "pending_owner_confirmation" as const,
  education: [
    {
      stage: "Medical school",
      institution: "St. George’s University School of Medicine",
      status: "confirmed" as const,
      note: "This institution is consistent across the supplied transcript/register and the current professional-profile record.",
    },
    {
      stage: "Internal medicine residency",
      institution: "Jackson Memorial / Jackson Health",
      status: "pending_owner_confirmation" as const,
      note: "The higher-authority meeting transcript/register identifies Jackson Memorial / Jackson Health. A prior site source used Drexel, so the source conflict remains recorded internally even though the latest user direction removes the public confirmation warning.",
    },
    {
      stage: "Cardiovascular disease fellowship",
      institution: null,
      status: "pending_owner_confirmation" as const,
      note: "Institution and dates require written owner confirmation because supplied sources conflict.",
    },
    {
      stage: "Clinical cardiac electrophysiology fellowship",
      institution: null,
      status: "pending_owner_confirmation" as const,
      note: "Institution and dates require written owner confirmation because supplied sources conflict.",
    },
  ] satisfies EducationFact[],
};
