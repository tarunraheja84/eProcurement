import { NoteType } from "@prisma/client";

export type Note  = {
noteId? : string;
entityType : NoteType;
entityId : string;
createdBy? : string;
createdAt? : string;
updatedBy? : string;
updatedAt? : string;
message : string;
}