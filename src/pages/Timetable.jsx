import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Save,
  BarChart3,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ---------------------- CONSTANTS ----------------------

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const TIME_SLOTS = [
  "09:00-09:50",
  "09:50-10:40",
  "10:40-11:30",
  "11:30-12:20",
  "12:20-13:10",
  "14:10-15:00",
  "15:00-15:50",
  "15:50-16:40",
];
const SUBJECT_COLORS = [
  "bg-education-blue/20 text-education-blue border-education-blue/30",
  "bg-education-green/20 text-education-green border-education-green/30",
  "bg-education-purple/20 text-education-purple border-education-purple/30",
  "bg-education-orange/20 text-education-orange border-education-orange/30",
  "bg-education-red/20 text-education-red border-education-red/30",
];

// ---------------------- UTILS ----------------------

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function initializeEmptyTimetable() {
  const timetable = {};
  DAYS.forEach((day) => {
    timetable[day] = {};
    PERIODS.forEach((period) => {
      timetable[day][period] = {};
    });
    // Lunch fixed at period V
    timetable[day]["V"] = {
      subject: "LUNCH BREAK",
      isLunch: true,
      color: "bg-muted text-muted-foreground",
    };
  });
  return timetable;
}

function generateTimetable(subjects, specialClasses, classrooms) {
  const timetable = initializeEmptyTimetable();
  let colorIndex = 0;

  // Randomize subject placement
  const randomizedSubjects = shuffleArray(subjects);

  randomizedSubjects.forEach((subject) => {
    const color = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];
    colorIndex++;

    let assigned = 0;
    const maxClasses = subject.classesPerWeek;

    while (assigned < maxClasses) {
      const day = DAYS[Math.floor(Math.random() * DAYS.length)];
      const period = PERIODS[Math.floor(Math.random() * PERIODS.length)];
      if (period === "V") continue; // skip lunch

      const cell = timetable[day][period];
      const prevPeriod = PERIODS[PERIODS.indexOf(period) - 1];
      const prevCell = prevPeriod ? timetable[day][prevPeriod] : null;

      // Skip if already filled
      if (cell.subject) continue;

      // Avoid consecutive duplicates unless high priority
      if (
        prevCell?.code === subject.code &&
        subject.priority !== "high"
      ) {
        continue;
      }

      timetable[day][period] = {
        subject: subject.name,
        code: subject.code,
        faculty: subject.faculties[0] || "TBA",
        venue: `Room ${Math.floor(Math.random() * classrooms) + 1}`,
        color,
      };
      assigned++;
    }
  });

  // Insert special classes (overwrite)
  specialClasses.forEach((cls) => {
    const day =
      cls.day.charAt(0).toUpperCase() + cls.day.slice(1).toLowerCase();
    const idx = parseInt(cls.period.replace(/\D/g, "")) - 1;
    if (DAYS.includes(day) && PERIODS[idx]) {
      timetable[day][PERIODS[idx]] = {
        subject: cls.name,
        venue: cls.venue,
        faculty: "Special",
        isSpecial: true,
        color: "bg-accent/20 text-accent border-accent/30",
      };
    }
  });

  return timetable;
}

// ---------------------- COMPONENT ----------------------

const Timetable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [timetableData, setTimetableData] = useState({});
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const data = location.state;
    if (!data) {
      navigate("/create");
      return;
    }
    const { subjects: subj, specialClasses, formData } = data;
    setSubjects(subj);
    setTimetableData(
      generateTimetable(subj, specialClasses, formData.classrooms)
    );
  }, [location.state, navigate]);

  const handleSave = () =>
    toast({ title: "Timetable Saved", description: "Your timetable is saved!" });

  const handleExportPDF = () =>
    toast({ title: "Export Started", description: "Generating PDF..." });

  const handleExportCSV = () =>
    toast({ title: "Export Started", description: "Generating CSV..." });

  const renderCell = (day, period) => {
    const cell = timetableData[day]?.[period];
    if (!cell || (!cell.subject && !cell.isLunch)) {
      return (
        <div className="p-2 h-20 border border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Free</span>
        </div>
      );
    }

    if (cell.isLunch) {
      return (
        <div className="p-2 h-20 bg-muted rounded flex flex-col items-center justify-center">
          <span className="font-medium text-sm">LUNCH BREAK</span>
          <span className="text-xs text-muted-foreground">
            13:10 - 14:10
          </span>
        </div>
      );
    }

    return (
      <div
        className={`p-2 h-20 border rounded ${
          cell.color || "bg-card"
        } flex flex-col justify-between text-xs`}
      >
        <div>
          <div className="font-medium truncate">{cell.code}</div>
          <div className="truncate">{cell.subject}</div>
        </div>
        <div className="text-xs opacity-75">
          <div className="truncate">{cell.faculty}</div>
          <div className="truncate">{cell.venue}</div>
        </div>
      </div>
    );
  };

  if (!Object.keys(timetableData).length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Generating timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Generated{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Timetable
              </span>
            </h1>
            <p className="text-muted-foreground">
              Your optimized class schedule is ready! You can modify it by
              dragging and dropping.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" /> CSV
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        <Card className="shadow-elevated mb-8 bg-gradient-card backdrop-blur border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weekly Schedule</span>
              <Badge variant="secondary">
                <Edit3 className="h-3 w-3 mr-1" /> Drag to Edit
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-9 gap-1 p-4 bg-muted/50">
                  <div className="font-semibold text-center py-2">
                    Day/Period
                  </div>
                  {PERIODS.map((p, i) => (
                    <div key={p} className="font-semibold text-center py-2">
                      <div>{p}</div>
                      <div className="text-xs text-muted-foreground font-normal">
                        {TIME_SLOTS[i]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timetable Rows */}
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="grid grid-cols-9 gap-1 p-4 border-t"
                  >
                    <div className="font-medium flex items-center justify-center bg-card/70 backdrop-blur rounded py-2">
                      {day}
                    </div>
                    {PERIODS.map((p) => (
                      <div key={`${day}-${p}`} className="min-h-[80px]">
                        {renderCell(day, p)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Legend */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
            <CardHeader>
              <CardTitle>Subject Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Classes/Week</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subj, i) => (
                    <TableRow key={subj.id}>
                      <TableCell>
                        <Badge
                          className={
                            SUBJECT_COLORS[i % SUBJECT_COLORS.length]
                          }
                        >
                          {subj.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {subj.name}
                      </TableCell>
                      <TableCell>
                        {subj.faculties[0] || "TBA"}
                      </TableCell>
                      <TableCell>{subj.classesPerWeek}</TableCell>
                      <TableCell>{subj.priority || "normal"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Faculty Workload */}
          <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
            <CardHeader>
              <CardTitle>Faculty Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subj) => (
                  <div
                    key={subj.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {subj.faculties[0] || "TBA"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subj.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (subj.classesPerWeek / 8) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {subj.classesPerWeek}/8
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Timetable;