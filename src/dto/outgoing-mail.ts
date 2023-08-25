import OutgoingMail from "../entities/outgoing-mail";
import User from "../entities/user";

export class NewMailDto {
  agenda?: string;
  number?: string;
  regarding?: string;
  destination?: string;
  explanation?: string;
  evidence?: string;
  attachment?: string;
  year?: string;
  mailingDate?: Date;
  archiver?: User;
}

export class MailListDto {
  uuid?: string;
  agenda?: string;
  number?: string;
  destination?: string;
  regarding?: string;
  mailingDate?: Date;
}

export interface PaginationOptions {
  pageNumber: number;
  pageSize: number;
  sortingField?: string;
  sortOrder?: "ASC" | "DESC";
  startDate?: string;
  endDate?: string;
  agenda?: string;
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface MailsResponse {
  mails: OutgoingMail[];
  pagination: PaginationInfo;
}
