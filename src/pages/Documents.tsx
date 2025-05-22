
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  Folder,
  File,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  Download,
  Trash2,
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  lastModified: string;
  updatedBy: string;
};

const Documents = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Mock data for files and folders
  const defaultFiles: Record<string, FileItem[]> = {
    "": [
      {
        id: "1",
        name: "Notices",
        type: "folder",
        lastModified: "2023-05-15",
        updatedBy: "System",
      },
      {
        id: "2",
        name: "Translated Notices",
        type: "folder",
        lastModified: "2023-05-15",
        updatedBy: "System",
      },
      {
        id: "3",
        name: "Other Templates",
        type: "folder",
        lastModified: "2023-05-15",
        updatedBy: "System",
      },
    ],
    "Notices": [
      {
        id: "4",
        name: "Standard Privacy Notice.pdf",
        type: "file",
        size: "245 KB",
        lastModified: "2023-05-20",
        updatedBy: "John Doe",
      },
      {
        id: "5",
        name: "Data Collection Notice.pdf",
        type: "file",
        size: "128 KB",
        lastModified: "2023-05-18",
        updatedBy: "Jane Smith",
      },
    ],
    "Translated Notices": [
      {
        id: "6",
        name: "Notice_Hindi.pdf",
        type: "file",
        size: "245 KB",
        lastModified: "2023-05-22",
        updatedBy: "System",
      },
      {
        id: "7",
        name: "Notice_Tamil.pdf",
        type: "file",
        size: "240 KB",
        lastModified: "2023-05-22",
        updatedBy: "System",
      },
    ],
    "Other Templates": [
      {
        id: "8",
        name: "Contract Template.docx",
        type: "file",
        size: "56 KB",
        lastModified: "2023-05-10",
        updatedBy: "Mike Johnson",
      },
    ],
  };

  const [files, setFiles] = useState(defaultFiles);

  const getCurrentFiles = () => {
    const key = currentPath.join("/");
    return files[key] || [];
  };

  const handleNavigate = (folder: string) => {
    setCurrentPath([...currentPath, folder]);
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const newFiles = [...getCurrentFiles()];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      newFiles.push({
        id: `new-${Date.now()}-${i}`,
        name: file.name,
        type: "file",
        size: `${Math.round(file.size / 1024)} KB`,
        lastModified: new Date().toISOString().split('T')[0],
        updatedBy: `${user?.firstName} ${user?.lastName}`,
      });
    }

    const key = currentPath.join("/");
    setFiles({
      ...files,
      [key]: newFiles,
    });

    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully.`,
    });
    
    // Reset the input field
    event.target.value = "";
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    const currentPathKey = currentPath.join("/");
    const folderExists = getCurrentFiles().some(
      file => file.type === "folder" && file.name === newFolderName
    );
    
    if (folderExists) {
      toast({
        title: "Error",
        description: `A folder named "${newFolderName}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: "folder",
      lastModified: new Date().toISOString().split('T')[0],
      updatedBy: `${user?.firstName} ${user?.lastName}`,
    };
    
    // Add the new folder to current path
    setFiles({
      ...files,
      [currentPathKey]: [...getCurrentFiles(), newFolder],
      // Create an empty array for the new folder's contents
      [currentPathKey ? `${currentPathKey}/${newFolderName}` : newFolderName]: [],
    });
    
    setNewFolderName("");
    setNewFolderDialogOpen(false);
    
    toast({
      title: "Folder Created",
      description: `Folder "${newFolderName}" created successfully.`,
    });
  };

  const handleDeleteItem = (item: FileItem) => {
    const currentPathKey = currentPath.join("/");
    
    if (item.type === "folder") {
      // For folders, we need to remove the folder and its contents
      const newFiles = { ...files };
      delete newFiles[currentPathKey ? `${currentPathKey}/${item.name}` : item.name];
      
      // Remove the folder from current directory
      newFiles[currentPathKey] = getCurrentFiles().filter(file => file.id !== item.id);
      
      setFiles(newFiles);
    } else {
      // For files, just remove the file from current directory
      setFiles({
        ...files,
        [currentPathKey]: getCurrentFiles().filter(file => file.id !== item.id),
      });
    }
    
    toast({
      title: "Item Deleted",
      description: `${item.type === "folder" ? "Folder" : "File"} "${item.name}" deleted successfully.`,
    });
  };

  const handleDownloadFile = (file: FileItem) => {
    // In a real application, this would trigger a download
    // Here we'll just show a toast
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Manage your organization's compliance documents and files.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={currentPath.length === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => setCurrentPath([])}>
                  Root
                </Button>
                {currentPath.map((folder, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                    >
                      {folder}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Folder Name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreateFolder}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  multiple
                />
                <Button variant="outline" size="sm">
                  <Upload className="mr-1 h-4 w-4" />
                  Upload Files
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentFiles().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      This folder is empty
                    </TableCell>
                  </TableRow>
                ) : (
                  getCurrentFiles().map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {file.type === "folder" ? (
                            <Folder className="h-5 w-5 mr-2 text-blue-500" />
                          ) : (
                            <File className="h-5 w-5 mr-2 text-gray-500" />
                          )}
                          <span
                            className={file.type === "folder" ? "cursor-pointer hover:text-blue-600" : ""}
                            onClick={() => file.type === "folder" && handleNavigate(file.name)}
                          >
                            {file.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{file.size || "-"}</TableCell>
                      <TableCell>{file.lastModified}</TableCell>
                      <TableCell>{file.updatedBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          {file.type === "file" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadFile(file)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p>
                                  Are you sure you want to delete {file.type === "folder" ? "folder" : "file"} "{file.name}"?
                                  {file.type === "folder" && " This will also delete all contents inside this folder."}
                                </p>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button variant="destructive" onClick={() => handleDeleteItem(file)}>
                                    Delete
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
