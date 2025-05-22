
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonalDataCategory, PersonalDataField } from "@/types/models";
import db from "@/services/mockDatabase";
import DataTable from "@/components/DataTable";
import { toast } from "@/hooks/use-toast";
import { ChevronRight, Download, Upload } from "lucide-react";

const Notices = () => {
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [selectedFields, setSelectedFields] = useState<Record<number, { selected: boolean; reason: string }>>({});
  const [noticeType, setNoticeType] = useState("");
  const [noticeTemplate, setNoticeTemplate] = useState("standard_privacy_notice.pdf");
  const [noticeBody, setNoticeBody] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, boolean>>({});
  const [selectAllLanguages, setSelectAllLanguages] = useState(false);
  const [translatedNotices, setTranslatedNotices] = useState<{ language: string; filename: string }[]>([]);
  
  // Load personal data categories and fields from mock database
  const categories = db.getPersonalDataCategories();
  const allFields = db.getPersonalDataFields();

  // Sample Templates
  const templates = [
    { id: 1, name: "Standard Privacy Notice", file: "standard_privacy_notice.pdf" },
    { id: 2, name: "E-commerce Privacy Notice", file: "ecommerce_privacy_notice.pdf" },
    { id: 3, name: "Healthcare Privacy Notice", file: "healthcare_privacy_notice.pdf" },
  ];

  // Indian languages for translation
  const indianLanguages = [
    "Assamese", "Bengali", "Gujarati", "Hindi", "Kannada", "Kashmiri",
    "Konkani", "Malayalam", "Manipuri", "Marathi", "Nepali", "Oriya",
    "Punjabi", "Sanskrit", "Sindhi", "Tamil", "Telugu", "Urdu",
    "Bodo", "Santhali", "Maithili", "Dogri"
  ];

  // Google Translate available languages (demo)
  const googleTranslateLanguages = [
    "Bengali", "Gujarati", "Hindi", "Kannada", "Malayalam", 
    "Marathi", "Nepali", "Punjabi", "Tamil", "Telugu", "Urdu"
  ];

  // Handle field selection
  const handleFieldSelection = (fieldId: number, selected: boolean) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldId]: {
        selected,
        reason: prev[fieldId]?.reason || ""
      }
    }));
  };

  // Handle reason change
  const handleReasonChange = (fieldId: number, reason: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldId]: {
        selected: prev[fieldId]?.selected || false,
        reason
      }
    }));
  };

  // Handle next button on Questionnaire tab
  const handleQuestionnaireNext = () => {
    const selectedFieldsData = Object.entries(selectedFields)
      .filter(([_, value]) => value.selected)
      .map(([key, value]) => {
        const fieldId = parseInt(key);
        const field = allFields.find(f => f.fieldId === fieldId);
        return {
          fieldId,
          fieldName: field?.fieldName || "",
          categoryName: field?.categoryName || "",
          reason: value.reason
        };
      });
    
    // Create a formatted dataset for the notice
    let formattedData = "Selected Personal Data Fields:\n\n";
    
    // Group by category
    const groupedByCategory: Record<string, { fieldName: string; reason: string }[]> = {};
    selectedFieldsData.forEach(field => {
      if (!groupedByCategory[field.categoryName]) {
        groupedByCategory[field.categoryName] = [];
      }
      groupedByCategory[field.categoryName].push({
        fieldName: field.fieldName,
        reason: field.reason
      });
    });
    
    // Format the data
    Object.entries(groupedByCategory).forEach(([category, fields]) => {
      formattedData += `${category}:\n`;
      fields.forEach(field => {
        formattedData += `- ${field.fieldName}: ${field.reason}\n`;
      });
      formattedData += "\n";
    });
    
    // Use this data in the notice editor
    setNoticeBody(formattedData);
    
    // Move to the next tab
    setActiveTab("notice");
  };

  // Handle next button on Notice tab
  const handleNoticeNext = () => {
    if (!noticeType) {
      toast({
        title: "Notice Type Required",
        description: "Please select a notice type.",
        variant: "destructive",
      });
      return;
    }
    
    if (!noticeBody.trim()) {
      toast({
        title: "Notice Content Required",
        description: "Please provide content for the notice.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate saving the notice
    toast({
      title: "Notice Created",
      description: "Your notice has been created successfully.",
    });
    
    // Move to the translation tab
    setActiveTab("translation");
  };

  // Handle language selection
  const handleLanguageSelection = (language: string, selected: boolean) => {
    setSelectedLanguages(prev => ({
      ...prev,
      [language]: selected
    }));
  };

  // Handle select all languages
  const handleSelectAllLanguages = (selected: boolean) => {
    setSelectAllLanguages(selected);
    
    const updatedSelection: Record<string, boolean> = {};
    indianLanguages.forEach(lang => {
      updatedSelection[lang] = selected;
    });
    
    setSelectedLanguages(updatedSelection);
  };

  // Handle translate button
  const handleTranslate = () => {
    const selectedLangs = Object.entries(selectedLanguages)
      .filter(([_, selected]) => selected)
      .map(([lang]) => lang);
    
    if (selectedLangs.length === 0) {
      toast({
        title: "No Languages Selected",
        description: "Please select at least one language for translation.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate translation process
    toast({
      title: "Translation Started",
      description: `Translating to ${selectedLangs.length} languages...`,
    });
    
    // Create mock translated notices
    const translatedDocs = selectedLangs.map(lang => ({
      language: lang,
      filename: `Notice_${lang}_1.pdf`
    }));
    
    setTimeout(() => {
      setTranslatedNotices(translatedDocs);
      toast({
        title: "Translation Complete",
        description: `Successfully translated to ${selectedLangs.length} languages.`,
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Notices</h2>
          <p className="text-muted-foreground">
            Create and manage your compliance notices.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="questionnaire">1. Questionnaire</TabsTrigger>
                <TabsTrigger value="notice">2. Notice Type & Preview</TabsTrigger>
                <TabsTrigger value="translation">3. Translation</TabsTrigger>
              </TabsList>
              
              {/* Questionnaire Tab */}
              <TabsContent value="questionnaire" className="complyark-tab-content">
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Select the categories of personal data collected by your organisation:
                  </p>
                  
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <Accordion type="single" collapsible key={category.categoryId}>
                        <AccordionItem value={`category-${category.categoryId}`}>
                          <AccordionTrigger>
                            <span className="font-medium">{category.categoryName}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {allFields
                                .filter((field) => field.categoryId === category.categoryId)
                                .map((field) => (
                                  <div key={field.fieldId} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-4 flex items-center space-x-2">
                                      <Checkbox 
                                        id={`field-${field.fieldId}`}
                                        checked={!!selectedFields[field.fieldId]?.selected}
                                        onCheckedChange={(checked) => 
                                          handleFieldSelection(field.fieldId, checked === true)
                                        }
                                      />
                                      <Label htmlFor={`field-${field.fieldId}`}>{field.fieldName}</Label>
                                    </div>
                                    <div className="col-span-8">
                                      <Input
                                        placeholder="Reason for collection"
                                        value={selectedFields[field.fieldId]?.reason || field.reasonForCollection}
                                        onChange={(e) => handleReasonChange(field.fieldId, e.target.value)}
                                        disabled={!selectedFields[field.fieldId]?.selected}
                                      />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleQuestionnaireNext}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Notice Type & Preview Tab */}
              <TabsContent value="notice" className="complyark-tab-content">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notice-type">Notice Type</Label>
                        <Input
                          id="notice-type"
                          placeholder="Enter notice type"
                          value={noticeType}
                          onChange={(e) => setNoticeType(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="template">Select Template</Label>
                        <Select
                          value={noticeTemplate}
                          onValueChange={setNoticeTemplate}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.file}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" /> Upload Notice Format
                        </Button>
                        <Button variant="outline">
                          Preview
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Data from Questionnaire</Label>
                      <div className="border rounded-md p-4 bg-muted/20 h-[300px] overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap">{noticeBody}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notice-editor">Notice Editor</Label>
                    <Textarea
                      id="notice-editor"
                      placeholder="Edit your notice content here"
                      rows={15}
                      value={`[PRIVACY NOTICE TEMPLATE]

Dear User,

This Privacy Notice explains how we collect, use, and protect your personal information. Please read this notice carefully.

1. INFORMATION WE COLLECT

${noticeBody}

2. HOW WE USE YOUR INFORMATION

We use your personal information for the following purposes:
- To provide and maintain our services
- To notify you about changes to our services
- To provide customer support
- To gather analysis or valuable information so that we can improve our services
- To detect, prevent and address technical issues

3. YOUR RIGHTS

You have the right to:
- Access your personal data
- Correct inaccurate personal data
- Delete your personal data
- Restrict or object to the processing of your personal data
- Data portability

For any questions or concerns, please contact our Data Protection Officer.

[END OF PRIVACY NOTICE]`}
                      onChange={(e) => setNoticeBody(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActiveTab("questionnaire")}>
                      Back
                    </Button>
                    <Button onClick={handleNoticeNext}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Translation Tab */}
              <TabsContent value="translation" className="complyark-tab-content">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Select Languages for Translation</h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={selectAllLanguages}
                          onCheckedChange={(checked) => 
                            handleSelectAllLanguages(checked === true)
                          }
                        />
                        <Label htmlFor="select-all">Select All</Label>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Languages available in Google Translate are shown in <span className="font-bold">bold</span>
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {indianLanguages.map((language) => {
                          const isGoogleTranslatable = googleTranslateLanguages.includes(language);
                          return (
                            <div key={language} className="flex items-center space-x-2">
                              <Checkbox
                                id={`lang-${language}`}
                                checked={!!selectedLanguages[language]}
                                onCheckedChange={(checked) => 
                                  handleLanguageSelection(language, checked === true)
                                }
                              />
                              <Label
                                htmlFor={`lang-${language}`}
                                className={isGoogleTranslatable ? "font-bold" : ""}
                              >
                                {language}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Translation Method</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="google-translate"
                            name="translation-method"
                            defaultChecked
                          />
                          <Label htmlFor="google-translate">Google Translate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="llm-model"
                            name="translation-method"
                            disabled
                          />
                          <Label htmlFor="llm-model">LLM Model (Coming Soon)</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleTranslate}>
                      Translate
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Available Notices</h3>
                    
                    {/* Original notice */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Original Document</h4>
                          <p className="text-sm text-muted-foreground">Notice_English.pdf</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> DOCX
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Translated notices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {translatedNotices.map((notice, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex flex-col h-full">
                            <div className="mb-2">
                              <h4 className="font-medium">{notice.language}</h4>
                              <p className="text-sm text-muted-foreground">{notice.filename}</p>
                            </div>
                            <div className="flex space-x-2 mt-auto">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" /> PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" /> DOCX
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("notice")}>
                      Back
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Process Complete",
                        description: "Your notice has been created and translated successfully.",
                      });
                      // Reset form and go back to first tab
                      setActiveTab("questionnaire");
                      setSelectedFields({});
                      setNoticeType("");
                      setNoticeBody("");
                      setSelectedLanguages({});
                      setSelectAllLanguages(false);
                      setTranslatedNotices([]);
                    }}>
                      Finish
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Existing Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={[
                {
                  id: 1,
                  name: "Standard Privacy Notice",
                  type: "Privacy Policy",
                  createdBy: "John Doe",
                  createdOn: "2023-05-20",
                  version: "V1",
                },
                {
                  id: 2,
                  name: "Data Collection Notice",
                  type: "Data Collection",
                  createdBy: "Jane Smith",
                  createdOn: "2023-05-18",
                  version: "V2",
                },
              ]}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { header: "Type", accessor: "type" },
                { header: "Created By", accessor: "createdBy" },
                { header: "Created On", accessor: "createdOn" },
                { header: "Version", accessor: "version" },
              ]}
              onView={(row) => console.log("View notice", row)}
              onEdit={(row) => console.log("Edit notice", row)}
              onDelete={(row) => console.log("Delete notice", row)}
              pagination={true}
              searchEnabled={true}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Notices;
