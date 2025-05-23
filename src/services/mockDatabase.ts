
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
    },
    { 
      organisationId: 2, 
      businessName: "HealthTech Solutions", 
      businessAddress: "456 Hospital Ave, Mumbai, Maharashtra, 400001", 
      industryId: 2, 
      industryName: "Healthcare", 
      contactPersonName: "Sarah Johnson", 
      contactEmailAddress: "sarah@healthtech.com", 
      contactPhoneNumber: "8765432109", 
      noOfUsers: 25, 
      remarks: "Healthcare technology provider" 
    },
    { 
      organisationId: 3, 
      businessName: "GameWorld", 
      businessAddress: "789 Gaming Blvd, Bangalore, Karnataka, 560001", 
      industryId: 3, 
      industryName: "Online Gaming", 
      contactPersonName: "Raj Patel", 
      contactEmailAddress: "raj@gameworld.com", 
      contactPhoneNumber: "7654321098", 
      noOfUsers: 15, 
      remarks: "Gaming platform with 2M+ users" 
    },
    { 
      organisationId: 4, 
      businessName: "SocialConnect", 
      businessAddress: "321 Network St, Delhi, Delhi, 110001", 
      industryId: 4, 
      industryName: "Social Media", 
      contactPersonName: "Priya Sharma", 
      contactEmailAddress: "priya@socialconnect.com", 
      contactPhoneNumber: "6543210987", 
      noOfUsers: 30, 
      remarks: "Growing social media platform" 
    },
    { 
      organisationId: 5, 
      businessName: "EduLearn Academy", 
      businessAddress: "654 Campus Rd, Hyderabad, Telangana, 500001", 
      industryId: 5, 
      industryName: "Educational Institution", 
      contactPersonName: "Anjali Mehta", 
      contactEmailAddress: "anjali@edulearn.com", 
      contactPhoneNumber: "5432109876", 
      noOfUsers: 20, 
      remarks: "Online education platform" 
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
    },
    {
      userId: 4,
      firstName: "Sarah",
      lastName: "Adams",
      email: "sarah@healthtech.com",
      phone: "7654321009",
      password: "admin2",
      role: "admin",
      organisationId: 2,
      organisationName: "HealthTech Solutions",
      isActive: true,
      createdAt: new Date("2023-05-15").toISOString(),
      edit: true,
      delete: true
    },
    {
      userId: 5,
      firstName: "Raj",
      lastName: "Patel",
      email: "raj@gameworld.com",
      phone: "7654321098",
      password: "admin3",
      role: "admin",
      organisationId: 3,
      organisationName: "GameWorld",
      isActive: true,
      createdAt: new Date("2023-06-20").toISOString(),
      edit: true,
      delete: true
    },
    {
      userId: 6,
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya@socialconnect.com",
      phone: "6543210987",
      password: "admin4",
      role: "admin",
      organisationId: 4,
      organisationName: "SocialConnect",
      isActive: true,
      createdAt: new Date("2023-07-25").toISOString(),
      edit: true,
      delete: true
    },
    {
      userId: 7,
      firstName: "Anjali",
      lastName: "Mehta",
      email: "anjali@edulearn.com",
      phone: "5432109876",
      password: "admin5",
      role: "admin",
      organisationId: 5,
      organisationName: "EduLearn Academy",
      isActive: true,
      createdAt: new Date("2023-08-10").toISOString(),
      edit: true,
      delete: true
    },
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

  // Add templates
  templates = [
    {
      templateId: 1,
      templateName: "Standard Privacy Notice",
      templateBody: "This is a standard privacy notice template for collecting personal information...",
      industryId: 1,
      industryName: "E-commerce",
      templatePath: "/TemplateRepo/standard_privacy_notice.pdf"
    },
    {
      templateId: 2,
      templateName: "Healthcare Privacy Policy",
      templateBody: "This privacy policy is designed for healthcare organizations to comply with HIPAA...",
      industryId: 2,
      industryName: "Healthcare",
      templatePath: "/TemplateRepo/healthcare_privacy.pdf"
    },
    {
      templateId: 3,
      templateName: "Gaming Data Collection Notice",
      templateBody: "This notice explains how we collect and process your gaming-related data...",
      industryId: 3,
      industryName: "Online Gaming",
      templatePath: "/TemplateRepo/gaming_notice.pdf"
    },
    {
      templateId: 4,
      templateName: "Social Media Data Policy",
      templateBody: "Our policy on how we handle your social media data and interactions...",
      industryId: 4,
      industryName: "Social Media",
      templatePath: "/TemplateRepo/social_media_policy.pdf"
    },
    {
      templateId: 5,
      templateName: "Educational Records Policy",
      templateBody: "How we maintain and protect educational records in compliance with regulations...",
      industryId: 5,
      industryName: "Educational Institution",
      templatePath: "/TemplateRepo/edu_records_policy.pdf"
    }
  ];

  // Add notices
  notices = [
    {
      noticeId: 1,
      organisationId: 1,
      noticeName: "Updated Privacy Policy",
      noticeBody: "We have updated our privacy policy to reflect changes in our data handling practices...",
      createdBy: 2,
      createdOn: new Date("2024-01-15").toISOString(),
      type: "Privacy Policy",
      version: "2.0",
      folderLocation: "/Notices/privacy_v2.pdf"
    },
    {
      noticeId: 2,
      organisationId: 2,
      noticeName: "Patient Data Protection Notice",
      noticeBody: "Information on how we protect your health data in compliance with regulations...",
      createdBy: 4,
      createdOn: new Date("2024-02-10").toISOString(),
      type: "Health Data Protection",
      version: "1.5",
      folderLocation: "/Notices/health_data_notice.pdf"
    },
    {
      noticeId: 3,
      organisationId: 3,
      noticeName: "User Gameplay Data Collection",
      noticeBody: "Details about how we collect and use your gameplay data to improve services...",
      createdBy: 5,
      createdOn: new Date("2024-03-05").toISOString(),
      type: "Data Collection Notice",
      version: "1.0",
      folderLocation: "/Notices/gameplay_data.pdf"
    },
    {
      noticeId: 4,
      organisationId: 4,
      noticeName: "Social Media Interaction Policy",
      noticeBody: "How we process and store your interactions on our platform...",
      createdBy: 6,
      createdOn: new Date("2024-04-20").toISOString(),
      type: "Usage Policy",
      version: "3.1",
      folderLocation: "/Notices/social_interactions.pdf"
    },
    {
      noticeId: 5,
      organisationId: 5,
      noticeName: "Student Data Privacy Notice",
      noticeBody: "Information about how we handle student records and educational data...",
      createdBy: 7,
      createdOn: new Date("2024-05-01").toISOString(),
      type: "Privacy Notice",
      version: "2.2",
      folderLocation: "/Notices/student_privacy.pdf"
    }
  ];

  // Add data principal requests
  dpRequests = [
    {
      dpRequestId: 1,
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@example.com",
      phone: "9876543210",
      requestType: "Access",
      requestComment: "I would like to access all my personal data that you have collected.",
      organisationId: 1,
      createdAt: new Date("2024-05-01").toISOString(),
      assignedTo: 2,
      completionDate: new Date("2024-05-08").toISOString(),
      completedOnTime: true,
      dpr_RequestStatusId: 2,
      closureComments: "",
      closureDateTime: ""
    },
    {
      dpRequestId: 2,
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@example.com",
      phone: "8765432109",
      requestType: "Correction",
      requestComment: "There is an error in my address information, please update it.",
      organisationId: 1,
      createdAt: new Date("2024-05-02").toISOString(),
      assignedTo: 3,
      completionDate: new Date("2024-05-09").toISOString(),
      completedOnTime: true,
      dpr_RequestStatusId: 3,
      closureComments: "",
      closureDateTime: ""
    },
    {
      dpRequestId: 3,
      firstName: "Ryan",
      lastName: "Taylor",
      email: "ryan.taylor@example.com",
      phone: "7654321098",
      requestType: "Erasure",
      requestComment: "I want all my data to be deleted from your systems.",
      organisationId: 2,
      createdAt: new Date("2024-05-03").toISOString(),
      assignedTo: 4,
      completionDate: new Date("2024-05-10").toISOString(),
      completedOnTime: true,
      dpr_RequestStatusId: 1,
      closureComments: "",
      closureDateTime: ""
    },
    {
      dpRequestId: 4,
      firstName: "Sophie",
      lastName: "Williams",
      email: "sophie.williams@example.com",
      phone: "6543210987",
      requestType: "Nomination",
      requestComment: "I would like to nominate someone to access my account in case of emergency.",
      organisationId: 3,
      createdAt: new Date("2024-05-04").toISOString(),
      assignedTo: 5,
      completionDate: new Date("2024-05-11").toISOString(),
      completedOnTime: true,
      dpr_RequestStatusId: 5,
      closureComments: "",
      closureDateTime: ""
    },
    {
      dpRequestId: 5,
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@example.com",
      phone: "5432109876",
      requestType: "Access",
      requestComment: "I need a copy of all my personal data in a portable format.",
      organisationId: 4,
      createdAt: new Date("2024-05-05").toISOString(),
      assignedTo: 6,
      completionDate: new Date("2024-05-12").toISOString(),
      completedOnTime: false,
      dpr_RequestStatusId: 6,
      closureComments: "Request completed and data provided in PDF format",
      closureDateTime: new Date("2024-05-15").toISOString()
    }
  ];

  // Add data request histories
  dpRequestHistories = [
    {
      historyId: 1,
      dpRequestId: 1,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 2,
      assignedToName: "admin",
      updatedBy: 2,
      updatedByName: "admin",
      updatedAt: new Date("2024-05-01").toISOString(),
      comments: "Request received and assigned",
      organisationId: 1
    },
    {
      historyId: 2,
      dpRequestId: 1,
      statusId: 2,
      statusName: "InProgress",
      assignedTo: 2,
      assignedToName: "admin",
      updatedBy: 2,
      updatedByName: "admin",
      updatedAt: new Date("2024-05-02").toISOString(),
      comments: "Started processing the request",
      organisationId: 1
    },
    {
      historyId: 3,
      dpRequestId: 2,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 3,
      assignedToName: "User One",
      updatedBy: 2,
      updatedByName: "admin",
      updatedAt: new Date("2024-05-02").toISOString(),
      comments: "Request received and assigned to User One",
      organisationId: 1
    },
    {
      historyId: 4,
      dpRequestId: 2,
      statusId: 3,
      statusName: "AwaitingInfo",
      assignedTo: 3,
      assignedToName: "User One",
      updatedBy: 3,
      updatedByName: "User One",
      updatedAt: new Date("2024-05-03").toISOString(),
      comments: "Waiting for additional information from the requestor",
      organisationId: 1
    },
    {
      historyId: 5,
      dpRequestId: 5,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 6,
      assignedToName: "Priya Sharma",
      updatedBy: 6,
      updatedByName: "Priya Sharma",
      updatedAt: new Date("2024-05-05").toISOString(),
      comments: "Request received",
      organisationId: 4
    },
    {
      historyId: 6,
      dpRequestId: 5,
      statusId: 2,
      statusName: "InProgress",
      assignedTo: 6,
      assignedToName: "Priya Sharma",
      updatedBy: 6,
      updatedByName: "Priya Sharma",
      updatedAt: new Date("2024-05-07").toISOString(),
      comments: "Processing request",
      organisationId: 4
    },
    {
      historyId: 7,
      dpRequestId: 5,
      statusId: 6,
      statusName: "Closed",
      assignedTo: 6,
      assignedToName: "Priya Sharma",
      updatedBy: 6,
      updatedByName: "Priya Sharma",
      updatedAt: new Date("2024-05-15").toISOString(),
      comments: "Request completed and data provided in PDF format",
      organisationId: 4
    }
  ];

  // Add grievances
  grievances = [
    {
      grievanceId: 1,
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@example.com",
      phone: "9876543211",
      organisationId: 1,
      grievanceComments: "My data appears to have been shared with third parties without my consent.",
      createdAt: new Date("2024-05-10").toISOString(),
      assignedTo: 2,
      completionDate: new Date("2024-05-17").toISOString(),
      completedOnTime: true,
      requestStatusId: 1,
      closureComments: "",
      closedDateTime: ""
    },
    {
      grievanceId: 2,
      firstName: "Emily",
      lastName: "Clark",
      email: "emily.clark@example.com",
      phone: "8765432110",
      organisationId: 1,
      grievanceComments: "I requested data deletion over a month ago but still receive marketing emails.",
      createdAt: new Date("2024-05-11").toISOString(),
      assignedTo: 3,
      completionDate: new Date("2024-05-18").toISOString(),
      completedOnTime: true,
      requestStatusId: 2,
      closureComments: "",
      closedDateTime: ""
    },
    {
      grievanceId: 3,
      firstName: "Michael",
      lastName: "Rodriguez",
      email: "michael.rodriguez@example.com",
      phone: "7654321109",
      organisationId: 2,
      grievanceComments: "My medical information was accessible to unauthorized staff members.",
      createdAt: new Date("2024-05-12").toISOString(),
      assignedTo: 4,
      completionDate: new Date("2024-05-19").toISOString(),
      completedOnTime: false,
      requestStatusId: 3,
      closureComments: "",
      closedDateTime: ""
    },
    {
      grievanceId: 4,
      firstName: "Jessica",
      lastName: "Martinez",
      email: "jessica.martinez@example.com",
      phone: "6543210988",
      organisationId: 3,
      grievanceComments: "My account was compromised and personal information was leaked.",
      createdAt: new Date("2024-05-13").toISOString(),
      assignedTo: 5,
      completionDate: new Date("2024-05-20").toISOString(),
      completedOnTime: true,
      requestStatusId: 5,
      closureComments: "",
      closedDateTime: ""
    },
    {
      grievanceId: 5,
      firstName: "Daniel",
      lastName: "Thompson",
      email: "daniel.thompson@example.com",
      phone: "5432109877",
      organisationId: 5,
      grievanceComments: "My child's educational records were shared without parental consent.",
      createdAt: new Date("2024-05-14").toISOString(),
      assignedTo: 7,
      completionDate: new Date("2024-05-21").toISOString(),
      completedOnTime: true,
      requestStatusId: 6,
      closureComments: "Issue resolved, records access restricted and apology issued",
      closedDateTime: new Date("2024-05-18").toISOString()
    }
  ];

  // Add grievance histories
  grievanceHistories = [
    {
      historyId: 1,
      grievanceId: 1,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 2,
      assignedToName: "admin",
      updatedBy: 2,
      updatedByName: "admin",
      updatedAt: new Date("2024-05-10").toISOString(),
      comments: "Grievance received and assigned",
      organisationId: 1
    },
    {
      historyId: 2,
      grievanceId: 2,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 3,
      assignedToName: "User One",
      updatedBy: 2,
      updatedByName: "admin",
      updatedAt: new Date("2024-05-11").toISOString(),
      comments: "Grievance received and assigned to User One",
      organisationId: 1
    },
    {
      historyId: 3,
      grievanceId: 2,
      statusId: 2,
      statusName: "InProgress",
      assignedTo: 3,
      assignedToName: "User One",
      updatedBy: 3,
      updatedByName: "User One",
      updatedAt: new Date("2024-05-12").toISOString(),
      comments: "Investigation started",
      organisationId: 1
    },
    {
      historyId: 4,
      grievanceId: 3,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 4,
      assignedToName: "Sarah Adams",
      updatedBy: 4,
      updatedByName: "Sarah Adams",
      updatedAt: new Date("2024-05-12").toISOString(),
      comments: "Grievance received",
      organisationId: 2
    },
    {
      historyId: 5,
      grievanceId: 3,
      statusId: 3,
      statusName: "AwaitingInfo",
      assignedTo: 4,
      assignedToName: "Sarah Adams",
      updatedBy: 4,
      updatedByName: "Sarah Adams",
      updatedAt: new Date("2024-05-14").toISOString(),
      comments: "Need more information about the incident",
      organisationId: 2
    },
    {
      historyId: 6,
      grievanceId: 5,
      statusId: 1,
      statusName: "Submitted",
      assignedTo: 7,
      assignedToName: "Anjali Mehta",
      updatedBy: 7,
      updatedByName: "Anjali Mehta",
      updatedAt: new Date("2024-05-14").toISOString(),
      comments: "Grievance received",
      organisationId: 5
    },
    {
      historyId: 7,
      grievanceId: 5,
      statusId: 6,
      statusName: "Closed",
      assignedTo: 7,
      assignedToName: "Anjali Mehta",
      updatedBy: 7,
      updatedByName: "Anjali Mehta",
      updatedAt: new Date("2024-05-18").toISOString(),
      comments: "Issue resolved, records access restricted and apology issued",
      organisationId: 5
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
