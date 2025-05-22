
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/DataTable";
import { Organisation, Industry } from "@/types/models";
import db from "@/services/mockDatabase";
import { toast } from "@/hooks/use-toast";
import { Copy, Link2 } from "lucide-react";

const OrganisationsAdmin = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [requestPageUrl, setRequestPageUrl] = useState<string>("");
  const [formData, setFormData] = useState<Partial<Organisation>>({
    businessName: "",
    businessAddress: "",
    industryId: 0,
    contactPersonName: "",
    contactEmailAddress: "",
    contactPhoneNumber: "",
    noOfUsers: 0,
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const orgsData = db.getOrganisations();
    const indData = db.getIndustries();
    setOrganisations(orgsData);
    setIndustries(indData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    const selectedIndustry = industries.find(ind => ind.industryId === parseInt(value));
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: parseInt(value),
      industryName: selectedIndustry?.industryName || ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.businessAddress || !formData.industryId || 
        !formData.contactPersonName || !formData.contactEmailAddress || !formData.contactPhoneNumber || 
        !formData.noOfUsers) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditing && selectedOrgId) {
      // Update existing organisation
      const updatedOrg = db.updateOrganisation({
        ...formData,
        organisationId: selectedOrgId,
      } as Organisation);
      
      if (updatedOrg) {
        toast({
          title: "Organisation Updated",
          description: `${updatedOrg.businessName} has been updated successfully.`,
        });
        resetForm();
        loadData();
      }
    } else {
      // Create new organisation
      const newOrg = db.addOrganisation(formData as Omit<Organisation, "organisationId">);
      
      // Create default admin user for the new organisation
      const defaultAdminUser = {
        firstName: "admin",
        lastName: "",
        email: `admin@${newOrg.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
        phone: "",
        password: `admin${newOrg.organisationId}`,
        role: "admin" as const,
        organisationId: newOrg.organisationId,
        organisationName: newOrg.businessName,
        isActive: true,
        createdAt: new Date().toISOString(),
        edit: true,
        delete: true,
      };
      
      db.addUser(defaultAdminUser);
      
      toast({
        title: "Organisation Created",
        description: `${newOrg.businessName} has been created successfully with a default admin user.`,
      });
      
      resetForm();
      loadData();
    }
  };

  const handleEdit = (org: Organisation) => {
    setIsEditing(true);
    setSelectedOrgId(org.organisationId);
    setFormData({
      businessName: org.businessName,
      businessAddress: org.businessAddress,
      industryId: org.industryId,
      industryName: org.industryName,
      contactPersonName: org.contactPersonName,
      contactEmailAddress: org.contactEmailAddress,
      contactPhoneNumber: org.contactPhoneNumber,
      noOfUsers: org.noOfUsers,
      remarks: org.remarks,
    });
    
    // Reset request page URL
    setRequestPageUrl("");
  };

  const handleDelete = async (org: Organisation) => {
    const deleted = db.deleteOrganisation(org.organisationId);
    
    if (deleted) {
      toast({
        title: "Organisation Deleted",
        description: `${org.businessName} has been deleted successfully.`,
      });
      loadData();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the organisation.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      businessName: "",
      businessAddress: "",
      industryId: 0,
      contactPersonName: "",
      contactEmailAddress: "",
      contactPhoneNumber: "",
      noOfUsers: 0,
      remarks: "",
    });
    setIsEditing(false);
    setSelectedOrgId(null);
    setRequestPageUrl("");
  };

  const generateRequestPageUrl = () => {
    if (!selectedOrgId) return;
    
    // Generate an encrypted URL (simple base64 for demo)
    const url = `http://localhost:8080/request-page/${btoa(`org=${selectedOrgId}`)}`;
    setRequestPageUrl(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(requestPageUrl);
    toast({
      title: "URL Copied",
      description: "The request page URL has been copied to clipboard.",
    });
  };

  const columns = [
    { header: "Business Name", accessor: "businessName" },
    { header: "Industry", accessor: "industryName" },
    { header: "Contact Person", accessor: "contactPersonName" },
    { header: "Email", accessor: "contactEmailAddress" },
    { header: "Phone", accessor: "contactPhoneNumber" },
    { header: "Users", accessor: "noOfUsers" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Organisation" : "Create Organisation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industryId?.toString()}
                    onValueChange={(value) => handleSelectChange("industryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem
                          key={industry.industryId}
                          value={industry.industryId.toString()}
                        >
                          {industry.industryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    name="businessAddress"
                    placeholder="Enter complete business address"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name</Label>
                  <Input
                    id="contactPersonName"
                    name="contactPersonName"
                    placeholder="Enter contact person name"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmailAddress">Contact Email Address</Label>
                  <Input
                    id="contactEmailAddress"
                    name="contactEmailAddress"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.contactEmailAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhoneNumber">Contact Phone Number</Label>
                  <Input
                    id="contactPhoneNumber"
                    name="contactPhoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.contactPhoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noOfUsers">Number of Users</Label>
                  <Input
                    id="noOfUsers"
                    name="noOfUsers"
                    type="number"
                    placeholder="Enter number of users"
                    value={formData.noOfUsers}
                    onChange={handleInputChange}
                    required
                    min={1}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    name="remarks"
                    placeholder="Enter remarks (optional)"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>

                {isEditing && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRequestPageUrl}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Generate Request Page URL
                      </Button>
                    </div>

                    {requestPageUrl && (
                      <div className="flex items-center gap-2 mt-2">
                        <Input value={requestPageUrl} readOnly />
                        <Button type="button" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organisations</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={organisations}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchEnabled={true}
              pagination={true}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrganisationsAdmin;
