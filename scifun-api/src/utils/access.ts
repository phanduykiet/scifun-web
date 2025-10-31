import dayjs from "dayjs";
import { IUser } from "../models/User";
import { IQuiz } from "../models/Quiz";

export function canAccessQuiz(user: IUser | null, quiz: IQuiz): boolean {
  if (quiz.accessTier === "FREE") return true;
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  const s = user.subscription;
  const active =
    s?.status === "ACTIVE" &&
    s?.tier === "PRO" &&
    s?.currentPeriodEnd &&
    dayjs(s.currentPeriodEnd).isAfter(dayjs());
  return !!active;
}
