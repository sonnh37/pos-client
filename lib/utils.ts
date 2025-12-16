import { BusinessResult, Status } from "@/types/models/business-result";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const processResponse = <T>(res: BusinessResult<T>) => {
  if (res.status !== Status.OK) {
    throw new Error(res.error?.detail || "API error");
  }
  return res.data as T;
};
