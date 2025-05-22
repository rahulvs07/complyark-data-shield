
import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequestPage } from "@/hooks/useRequestPage";
import LoginForm from "@/components/request/LoginForm";
import RequestTypeSelector from "@/components/request/RequestTypeSelector";
import RequestForm from "@/components/request/RequestForm";
import SubmissionConfirmation from "@/components/request/SubmissionConfirmation";
import RequestHeader from "@/components/request/RequestHeader";

const RequestPage = () => {
  const { orgIdEncoded } = useParams<{ orgIdEncoded: string }>();
  const {
    orgName,
    requestType,
    isLoggedIn,
    isSubmitted,
    isLoading,
    firstName,
    lastName,
    email,
    phone,
    dpRequestType,
    comments,
    setRequestType,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setDpRequestType,
    setComments,
    handleLogin,
    handleSubmit,
    handleLogout
  } = useRequestPage({ orgIdEncoded });

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 p-6">
      <header className="w-full max-w-3xl mx-auto mb-8">
        <RequestHeader 
          orgName={orgName} 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
        />
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {!isLoggedIn ? (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to {orgName}</CardTitle>
                <CardDescription>
                  Please log in to submit a request or grievance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm 
                  email={email} 
                  setEmail={setEmail} 
                  isLoading={isLoading} 
                  onLogin={handleLogin} 
                />
              </CardContent>
            </Card>
          ) : !requestType && !isSubmitted ? (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Select Request Type</CardTitle>
                <CardDescription>
                  Please select the type of request you would like to submit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RequestTypeSelector setRequestType={setRequestType} />
              </CardContent>
            </Card>
          ) : isSubmitted ? (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Request Submitted</CardTitle>
                <CardDescription>
                  Your request has been successfully submitted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SubmissionConfirmation onLogout={handleLogout} />
              </CardContent>
            </Card>
          ) : (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {requestType === "dp-request"
                    ? "Data Principal Request"
                    : "Grievance Logging"}
                </CardTitle>
                <CardDescription>
                  Please fill out the form below to submit your request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequestForm 
                  requestType={requestType}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  dpRequestType={dpRequestType}
                  setDpRequestType={setDpRequestType}
                  comments={comments}
                  setComments={setComments}
                  isLoading={isLoading}
                  handleSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestPage;
