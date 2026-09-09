import { AudioLines, BookOpenText, Clock3, MessagesSquare, type LucideIcon } from "lucide-react";
import type { WorkspaceMode } from "@/data/mockData";

/** The single icon set used for every Kivi context. */
export const contextIcons: Record<WorkspaceMode, LucideIcon> = {
  utility: AudioLines,
  narratives: BookOpenText,
  conversations: MessagesSquare,
  ambient: Clock3,
};
