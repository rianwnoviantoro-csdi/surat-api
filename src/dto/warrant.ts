import Warrant from "src/entities/warrant";
import User from "../entities/user";

export class NewMailDto {
  agenda?: string;
  number?: string;
  program?: string;
  place?: string;
  evidence?: string;
  year?: string;
  attachment?: string;
  startDate?: Date;
  endDate?: Date;
  mailingDate?: Date;
  employee?: string;
  dipa?: boolean;
  archiver?: User;
  is_active?: boolean;
}

export interface PaginationOptions {
  pageNumber: number;
  pageSize: number;
  sortingField?: string;
  sortOrder?: "ASC" | "DESC";
  startDate?: string;
  endDate?: string;
  agenda?: string;
  active?: boolean;
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface MailsResponse {
  mails: Warrant[];
  pagination: PaginationInfo;
}
