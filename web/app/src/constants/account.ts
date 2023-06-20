export const GENDER = ["MALE", "FEMALE"] as const;

export const GENDER_TEXTS: Record<typeof GENDER[number], string> = {
  MALE: "男性",
  FEMALE: "女性",
};

export const ATTRIBUTE = {
  PRODUCER: "producer",
  CONSUMER: "consumer",
  LOGISTICS: "logistics",
  INTERMEDIARY: "intermediary",
};
