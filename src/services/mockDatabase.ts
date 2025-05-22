
import { 
  Organisation, User, Industry, Template, Notice, 
  RequestStatus, DPRequest, DPRequestHistory, 
  Grievance, GrievanceHistory, PersonalDataCategory, 
  PersonalDataField 
} from "@/types/models";

// Mock database tables
let organisations: Organisation[] = [];
let users: User[] = [];
let industries: Industry[] = [];
let templates: Template[] = [];
let notices: Notice[] = [];
let requestStatuses: RequestStatus[] = [];
let dpRequests: DPRequest[] = [];
let dpRequestHistories: DPRequestHistory[] = [];
let grievances: Grievance[] = [];
let grievanceHistories: GrievanceHistory[] = [];
let personalDataCategories: PersonalDataCategory[] = [];
let personalDataFields: PersonalDataField[] = [];

// Initialize with seed data
const initDatabase = () => {
  // Add industries
  industries = [
    { industryId: 1, industryName: "E-commerce" },
    { industryId: 2, industryName: "Healthcare" },
    { industryId: 3, industryName: "Online Gaming" },
    { industryId: 4, industryName: "Social Media" },
    { industryId: 5, industryName: "Educational Institution" }
  ];

  // Add request statuses
  requestStatuses = [
    { requestStatusId: 1, requestStatus: "Submitted", isActive: true, sla: 7 },
    { requestStatusId: 2, requestStatus: "InProgress", isActive: true, sla: 5 },
    { requestStatusId: 3, requestStatus: "AwaitingInfo", isActive: true, sla: 3 },
    { requestStatusId: 4, requestStatus: "Reassigned", isActive: true, sla: 5 },
    { requestStatusId: 5, requestStatus: "Escalated", isActive: true, sla: 2 },
    { requestStatusId: 6, requestStatus: "Closed", isActive: true, sla: 0 }
  ];

  // Add organisations
  organisations = [
    { 
      organisationId: 1, 
      businessName: "Demo Corp", 
      businessAddress: "123 Main St, Chennai, Tamil Nadu, 600001", 
      industryId: 1, 
      industryName: "E-commerce", 
      contactPersonName: "John Doe", 
      contactEmailAddress: "john.doe@democorp.com", 
      contactPhoneNumber: "9876543210", 
      noOfUsers: 10, 
      remarks: "Demo organization" 
    }
  ];

  // Add users (including system admin and org admin)
  users = [
    {
      userId: 1,
      firstName: "complyark",
      lastName: "admin",
      email: "complyarkadmin",
      phone: "9999999999",
      password: "complyarkadmin",
      role: "admin",
      organisationId: 0, // 0 means system admin
      organisationName: "System",
      isActive: true,
      createdAt: new Date().toISOString(),
      edit: true,
      delete: true
    },
    {
      userId: 2,
      firstName: "admin",
      lastName: "",
      email: "admin@democorp.com",
      phone: "8888888888",
      password: "admin1", // admin + organisationId
      role: "admin",
      organisationId: 1,
      organisationName: "Demo Corp",
      isActive: true,
      createdAt: new Date().toISOString(),
      edit: true,
      delete: true
    },
    {
      userId: 3,
      firstName: "User",
      lastName: "One",
      email: "user1@democorp.com",
      phone: "7777777777",
      password: "password",
      role: "user",
      organisationId: 1,
      organisationName: "Demo Corp",
      isActive: true,
      createdAt: new Date().toISOString(),
      edit: false,
      delete: false
    }
  ];

  // Add personal data categories
  personalDataCategories = [
    { categoryId: 1, categoryName: "Name", isActive: true },
    { categoryId: 2, categoryName: "Contact Details", isActive: true },
    { categoryId: 3, categoryName: "Email", isActive: true },
    { categoryId: 4, categoryName: "Phone", isActive: true },
    { categoryId: 5, categoryName: "Financial Info", isActive: true },
    { categoryId: 6, categoryName: "Health Data", isActive: true },
    { categoryId: 7, categoryName: "Demographics", isActive: true },
    { categoryId: 8, categoryName: "Sensitive Data", isActive: true }
  ];

  // Add personal data fields
  personalDataFields = [
    { fieldId: 1, fieldName: "First Name", categoryId: 1, categoryName: "Name", reasonForCollection: "To identify the individual correctly.", isActive: true },
    { fieldId: 2, fieldName: "Middle Name", categoryId: 1, categoryName: "Name", reasonForCollection: "For full legal identification.", isActive: true },
    { fieldId: 3, fieldName: "Last Name", categoryId: 1, categoryName: "Name", reasonForCollection: "To identify the individual correctly.", isActive: true },
    { fieldId: 4, fieldName: "Preferred Name / Nickname", categoryId: 1, categoryName: "Name", reasonForCollection: "For personalised communication.", isActive: true },
    { fieldId: 5, fieldName: "Former Name(s)", categoryId: 1, categoryName: "Name", reasonForCollection: "For record-keeping and legal verification.", isActive: true },
    
    { fieldId: 6, fieldName: "Residential Address", categoryId: 2, categoryName: "Contact Details", reasonForCollection: "For official correspondence and service delivery.", isActive: true },
    { fieldId: 7, fieldName: "Mailing Address", categoryId: 2, categoryName: "Contact Details", reasonForCollection: "To send documents, communications, or parcels.", isActive: true },
    { fieldId: 8, fieldName: "Country of Residence", categoryId: 2, categoryName: "Contact Details", reasonForCollection: "For compliance with regional laws.", isActive: true },
    
    // Add more fields as needed
  ];

  // Initialize templates
  templates = [
    {
      templateId: 1,
      templateName: "Standard Privacy Notice",
      templateBody: "This is a standard privacy notice template for collecting personal information...",
      industryId: 1,
      industryName: "E-commerce",
      templatePath: "/TemplateRepo/standard_privacy_notice.pdf"
    }
  ];
};

// Initialize the database
initDatabase();

// Export mock database operations
const db = {
  // Organisation operations
  getOrganisations: () => [...organisations],
  getOrganisationById: (id: number) => organisations.find(org => org.organisationId === id),
  addOrganisation: (org: Omit<Organisation, "organisationId">) => {
    const newId = organisations.length > 0 ? Math.max(...organisations.map(o => o.organisationId)) + 1 : 1;
    const newOrg: Organisation = { ...org, organisationId: newId };
    organisations.push(newOrg);
    return newOrg;
  },
  updateOrganisation: (org: Organisation) => {
    const index = organisations.findIndex(o => o.organisationId === org.organisationId);
    if (index >= 0) {
      organisations[index] = org;
      return org;
    }
    return null;
  },
  deleteOrganisation: (id: number) => {
    const index = organisations.findIndex(o => o.organisationId === id);
    if (index >= 0) {
      organisations.splice(index, 1);
      return true;
    }
    return false;
  },

  // User operations
  getUsers: () => [...users],
  getUsersByOrganisationId: (orgId: number) => users.filter(u => u.organisationId === orgId),
  getUserById: (id: number) => users.find(u => u.userId === id),
  addUser: (user: Omit<User, "userId">) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.userId)) + 1 : 1;
    const newUser: User = { ...user, userId: newId };
    users.push(newUser);
    return newUser;
  },
  updateUser: (user: User) => {
    const index = users.findIndex(u => u.userId === user.userId);
    if (index >= 0) {
      users[index] = user;
      return user;
    }
    return null;
  },
  deleteUser: (id: number) => {
    const index = users.findIndex(u => u.userId === id);
    if (index >= 0) {
      users.splice(index, 1);
      return true;
    }
    return false;
  },

  // Industry operations
  getIndustries: () => [...industries],
  getIndustryById: (id: number) => industries.find(i => i.industryId === id),
  addIndustry: (industry: Omit<Industry, "industryId">) => {
    const newId = industries.length > 0 ? Math.max(...industries.map(i => i.industryId)) + 1 : 1;
    const newIndustry: Industry = { ...industry, industryId: newId };
    industries.push(newIndustry);
    return newIndustry;
  },
  updateIndustry: (industry: Industry) => {
    const index = industries.findIndex(i => i.industryId === industry.industryId);
    if (index >= 0) {
      industries[index] = industry;
      return industry;
    }
    return null;
  },
  deleteIndustry: (id: number) => {
    const index = industries.findIndex(i => i.industryId === id);
    if (index >= 0) {
      industries.splice(index, 1);
      return true;
    }
    return false;
  },

  // Template operations
  getTemplates: () => [...templates],
  getTemplateById: (id: number) => templates.find(t => t.templateId === id),
  addTemplate: (template: Omit<Template, "templateId">) => {
    const newId = templates.length > 0 ? Math.max(...templates.map(t => t.templateId)) + 1 : 1;
    const newTemplate: Template = { ...template, templateId: newId };
    templates.push(newTemplate);
    return newTemplate;
  },
  updateTemplate: (template: Template) => {
    const index = templates.findIndex(t => t.templateId === template.templateId);
    if (index >= 0) {
      templates[index] = template;
      return template;
    }
    return null;
  },
  deleteTemplate: (id: number) => {
    const index = templates.findIndex(t => t.templateId === id);
    if (index >= 0) {
      templates.splice(index, 1);
      return true;
    }
    return false;
  },

  // Request Status operations
  getRequestStatuses: () => [...requestStatuses],
  getRequestStatusById: (id: number) => requestStatuses.find(s => s.requestStatusId === id),
  addRequestStatus: (status: Omit<RequestStatus, "requestStatusId">) => {
    const newId = requestStatuses.length > 0 ? Math.max(...requestStatuses.map(s => s.requestStatusId)) + 1 : 1;
    const newStatus: RequestStatus = { ...status, requestStatusId: newId };
    requestStatuses.push(newStatus);
    return newStatus;
  },
  updateRequestStatus: (status: RequestStatus) => {
    const index = requestStatuses.findIndex(s => s.requestStatusId === status.requestStatusId);
    if (index >= 0) {
      requestStatuses[index] = status;
      return status;
    }
    return null;
  },

  // Notice operations
  getNotices: (orgId?: number) => orgId ? notices.filter(n => n.organisationId === orgId) : [...notices],
  getNoticeById: (id: number) => notices.find(n => n.noticeId === id),
  addNotice: (notice: Omit<Notice, "noticeId">) => {
    const newId = notices.length > 0 ? Math.max(...notices.map(n => n.noticeId)) + 1 : 1;
    const newNotice: Notice = { ...notice, noticeId: newId };
    notices.push(newNotice);
    return newNotice;
  },
  updateNotice: (notice: Notice) => {
    const index = notices.findIndex(n => n.noticeId === notice.noticeId);
    if (index >= 0) {
      notices[index] = notice;
      return notice;
    }
    return null;
  },

  // DP Request operations
  getDPRequests: (orgId?: number) => orgId ? dpRequests.filter(r => r.organisationId === orgId) : [...dpRequests],
  getDPRequestById: (id: number) => dpRequests.find(r => r.dpRequestId === id),
  addDPRequest: (request: Omit<DPRequest, "dpRequestId">) => {
    const newId = dpRequests.length > 0 ? Math.max(...dpRequests.map(r => r.dpRequestId)) + 1 : 1;
    const newRequest: DPRequest = { ...request, dpRequestId: newId };
    dpRequests.push(newRequest);
    return newRequest;
  },
  updateDPRequest: (request: DPRequest) => {
    const index = dpRequests.findIndex(r => r.dpRequestId === request.dpRequestId);
    if (index >= 0) {
      dpRequests[index] = request;
      return request;
    }
    return null;
  },

  // DP Request History operations
  getDPRequestHistory: (requestId: number) => dpRequestHistories.filter(h => h.dpRequestId === requestId),
  addDPRequestHistory: (history: Omit<DPRequestHistory, "historyId">) => {
    const newId = dpRequestHistories.length > 0 ? Math.max(...dpRequestHistories.map(h => h.historyId)) + 1 : 1;
    const newHistory: DPRequestHistory = { ...history, historyId: newId };
    dpRequestHistories.push(newHistory);
    return newHistory;
  },

  // Grievance operations
  getGrievances: (orgId?: number) => orgId ? grievances.filter(g => g.organisationId === orgId) : [...grievances],
  getGrievanceById: (id: number) => grievances.find(g => g.grievanceId === id),
  addGrievance: (grievance: Omit<Grievance, "grievanceId">) => {
    const newId = grievances.length > 0 ? Math.max(...grievances.map(g => g.grievanceId)) + 1 : 1;
    const newGrievance: Grievance = { ...grievance, grievanceId: newId };
    grievances.push(newGrievance);
    return newGrievance;
  },
  updateGrievance: (grievance: Grievance) => {
    const index = grievances.findIndex(g => g.grievanceId === grievance.grievanceId);
    if (index >= 0) {
      grievances[index] = grievance;
      return grievance;
    }
    return null;
  },

  // Grievance History operations
  getGrievanceHistory: (grievanceId: number) => grievanceHistories.filter(h => h.grievanceId === grievanceId),
  addGrievanceHistory: (history: Omit<GrievanceHistory, "historyId">) => {
    const newId = grievanceHistories.length > 0 ? Math.max(...grievanceHistories.map(h => h.historyId)) + 1 : 1;
    const newHistory: GrievanceHistory = { ...history, historyId: newId };
    grievanceHistories.push(newHistory);
    return newHistory;
  },

  // Personal Data Category operations
  getPersonalDataCategories: () => [...personalDataCategories],
  
  // Personal Data Field operations
  getPersonalDataFields: () => [...personalDataFields],
  getPersonalDataFieldsByCategory: (categoryId: number) => personalDataFields.filter(f => f.categoryId === categoryId),

  // Authentication
  login: (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    return user ? { ...user, password: undefined } : null;
  },
  
  // Reset database (for testing)
  resetDatabase: () => {
    initDatabase();
    return true;
  }
};

export default db;
