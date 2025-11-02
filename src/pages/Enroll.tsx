import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface EnrollmentData {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  pdfFile: string;
  timestamp: number;
}

export default function Enroll() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.age || !formData.gender || !pdfFile) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and upload a PDF.",
        variant: "destructive",
      });
      return;
    }

    const enrollmentData: EnrollmentData = {
      id: Date.now().toString(),
      ...formData,
      pdfFile: pdfFile.name,
      timestamp: Date.now(),
    };

    const existingData = localStorage.getItem("enrollments");
    const enrollments = existingData ? JSON.parse(existingData) : [];
    enrollments.push(enrollmentData);
    localStorage.setItem("enrollments", JSON.stringify(enrollments));

    toast({
      title: "Success!",
      description: "Your enrollment has been submitted successfully.",
    });

    setFormData({ name: "", phone: "", email: "", age: "", gender: "" });
    setPdfFile(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Enrollment Form</CardTitle>
            <CardDescription>Fill in your details to enroll in the program</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="25"
                  min="1"
                  max="150"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf">Upload PDF Document</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    required
                  />
                  {pdfFile && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      <span className="truncate max-w-[150px]">{pdfFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Enrollment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
