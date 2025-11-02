import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Shuffle, Timer, RotateCcw, Play, Users } from "lucide-react";

interface EnrollmentData {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  pdfFile: string;
  timestamp: number;
  group?: "A" | "B";
}

export default function View() {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [groupA, setGroupA] = useState<EnrollmentData[]>([]);
  const [groupB, setGroupB] = useState<EnrollmentData[]>([]);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "Timer Complete!",
              description: "The countdown has finished.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTime]);

  const loadEnrollments = () => {
    const data = localStorage.getItem("enrollments");
    if (data) {
      const parsed = JSON.parse(data);
      setEnrollments(parsed);
    }
  };

  const randomizeGroups = () => {
    if (enrollments.length === 0) {
      toast({
        title: "No enrollments",
        description: "There are no users to randomize.",
        variant: "destructive",
      });
      return;
    }

    const shuffled = [...enrollments].sort(() => Math.random() - 0.5);
    const midpoint = Math.ceil(shuffled.length / 2);
    
    const newGroupA = shuffled.slice(0, midpoint).map(user => ({ ...user, group: "A" as const }));
    const newGroupB = shuffled.slice(midpoint).map(user => ({ ...user, group: "B" as const }));
    
    setGroupA(newGroupA);
    setGroupB(newGroupB);

    toast({
      title: "Groups Randomized!",
      description: `${newGroupA.length} users in Group A, ${newGroupB.length} users in Group B`,
    });
  };

  const resetUsers = () => {
    localStorage.removeItem("enrollments");
    setEnrollments([]);
    setGroupA([]);
    setGroupB([]);
    toast({
      title: "Users Reset",
      description: "All enrollment data has been cleared.",
    });
  };

  const setTimer = () => {
    const totalSeconds = timerMinutes * 60 + timerSeconds;
    if (totalSeconds <= 0) {
      toast({
        title: "Invalid timer",
        description: "Please set a time greater than 0.",
        variant: "destructive",
      });
      return;
    }
    setRemainingTime(totalSeconds);
    setIsTimerRunning(false);
    toast({
      title: "Timer Set",
      description: `Timer set to ${timerMinutes}m ${timerSeconds}s`,
    });
  };

  const startTimer = () => {
    if (remainingTime <= 0) {
      toast({
        title: "No timer set",
        description: "Please set a timer first.",
        variant: "destructive",
      });
      return;
    }
    setIsTimerRunning(true);
    toast({
      title: "Timer Started",
      description: "Countdown has begun!",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderTable = (data: EnrollmentData[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>PDF File</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No enrollments yet
            </TableCell>
          </TableRow>
        ) : (
          data.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell className="capitalize">{user.gender}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.pdfFile}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">View Enrollments</h1>
              <p className="text-muted-foreground">Manage and organize enrolled users</p>
            </div>
            <div className="flex items-center gap-2 text-2xl font-mono font-bold">
              <Timer className="h-6 w-6" />
              <span className={isTimerRunning ? "text-primary animate-pulse" : ""}>
                {formatTime(remainingTime)}
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Timer & Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seconds">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                  />
                </div>
                <Button onClick={setTimer} variant="outline" className="mt-auto">
                  <Timer className="mr-2 h-4 w-4" />
                  Set Timer
                </Button>
                <Button onClick={startTimer} variant="default" className="mt-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Start Timer
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={randomizeGroups} variant="secondary">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Randomize Groups
                </Button>
                <Button onClick={resetUsers} variant="destructive">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Users
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                <Users className="mr-2 h-4 w-4" />
                All Users ({enrollments.length})
              </TabsTrigger>
              <TabsTrigger value="groupA">Group A ({groupA.length})</TabsTrigger>
              <TabsTrigger value="groupB">Group B ({groupB.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Enrolled Users</CardTitle>
                </CardHeader>
                <CardContent>{renderTable(enrollments)}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="groupA">
              <Card>
                <CardHeader>
                  <CardTitle>Group A</CardTitle>
                </CardHeader>
                <CardContent>{renderTable(groupA)}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="groupB">
              <Card>
                <CardHeader>
                  <CardTitle>Group B</CardTitle>
                </CardHeader>
                <CardContent>{renderTable(groupB)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
