"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getContract, createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

interface EnrollmentData {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
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

  const ContractAddress = "0xE19b7C663051327aCD91537e71fA1FE2E04De50f";
  const ContractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [{ internalType: "string", name: "name", type: "string" }],
      name: "addParticipant",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getGroupA",
      outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGroupB",
      outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit Enrollment (addParticipant)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.age || !formData.gender) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!(window as any).ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom((window as any).ethereum),
      });

      const accounts = await walletClient.requestAddresses();
      const address = accounts[0];

      const ContractInstance = getContract({
        address: ContractAddress,
        abi: ContractABI,
        client: walletClient,
      });

      toast({
        title: "Transaction started",
        description: "Please confirm the transaction in MetaMask...",
      });

      await ContractInstance.write.addParticipant({
        account: address as `0x${string}`,
        args: [formData.name],
      });

      toast({
        title: "Success 🎉",
        description: "Your name has been recorded on the blockchain!",
      });

      // Save locally
      const enrollmentData: EnrollmentData = {
        id: Date.now().toString(),
        ...formData,
        timestamp: Date.now(),
      };

      const existingData = localStorage.getItem("enrollments");
      const enrollments = existingData ? JSON.parse(existingData) : [];
      enrollments.push(enrollmentData);
      localStorage.setItem("enrollments", JSON.stringify(enrollments));

      setFormData({ name: "", phone: "", email: "", age: "", gender: "" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Transaction failed",
        description:
          "Make sure you have test ETH on Sepolia and the contract address is correct.",
        variant: "destructive",
      });
    }
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
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
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
