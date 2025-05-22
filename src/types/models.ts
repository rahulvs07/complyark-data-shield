
// Define the core data models

export interface Organisation {
  organisationId: number;
  businessName: string;
  businessAddress: string;
  industryId: number;
  industryName: string;
  contactPersonName: string;
  contactEmailAddress: string;
  contactPhoneNumber: string;
  noOfUsers: number;
  remarks: string;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user";
  organisationId: number;
  organisationName: string;
  isActive: boolean;
  createdAt: string;
  edit: boolean;
  delete: boolean;
}

export interface Industry {
  industryId: number;
  industryName: string;
}

export interface Template {
  templateId: number;
  templateName: string;
  templateBody: string;
  industryId: number;
  industryName: string;
  templatePath: string;
}

export interface Notice {
  noticeId: number;
  organisationId: number;
  noticeName: string;
  noticeBody: string;
  createdBy: number;
  createdOn: string;
  type: string;
  version: string;
  folderLocation: string;
}

export interface RequestStatus {
  requestStatusId: number;
  requestStatus: string;
  isActive: boolean;
  sla: number;
}

export interface DPRequest {
  dpRequestId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requestType: "Access" | "Correction" | "Nomination" | "Erasure";
  requestComment: string;
  organisationId: number;
  createdAt: string;
  assignedTo: number;
  completionDate: string;
  completedOnTime: boolean;
  dpr_RequestStatusId: number;
  closureComments: string;
  closureDateTime: string;
}

export interface DPRequestHistory {
  historyId: number;
  dpRequestId: number;
  statusId: number;
  statusName: string;
  assignedTo: number;
  assignedToName: string;
  updatedBy: number;
  updatedByName: string;
  updatedAt: string;
  comments: string;
  organisationId: number;
}

export interface Grievance {
  grievanceId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisationId: number;
  grievanceComments: string;
  createdAt: string;
  assignedTo: number;
  completionDate: string;
  completedOnTime: boolean;
  requestStatusId: number;
  closureComments: string;
  closedDateTime: string;
}

export interface GrievanceHistory {
  historyId: number;
  grievanceId: number;
  statusId: number;
  statusName: string;
  assignedTo: number;
  assignedToName: string;
  updatedBy: number;
  updatedByName: string;
  updatedAt: string;
  comments: string;
  organisationId: number;
}

export interface PersonalDataCategory {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
}

export interface PersonalDataField {
  fieldId: number;
  fieldName: string;
  categoryId: number;
  categoryName: string;
  reasonForCollection: string;
  isActive: boolean;
}
