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
import { Link } from "react-router-dom";
import {
  Download,
  Save,
  BarChart3,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as htmlToImage from "html-to-image";

// ---------------------- CONSTANTS ----------------------

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
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
  const [dragSource, setDragSource] = useState(null); // { day, period }
  const [dragOverKey, setDragOverKey] = useState(null); // `${day}-${period}`

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

  const classDurationMinutes = location.state?.formData?.classDurationMinutes || 50;

  const computeTimeSlots = () => {
    // Start at 09:00, periods I-IV continuous, lunch (60m), then VI-VIII
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    let hour = 9;
    let minute = 0;
    const slots = [];
    const add = (mins) => {
      const startH = hour, startM = minute;
      minute += mins;
      while (minute >= 60) { minute -= 60; hour += 1; }
      return `${pad(startH)}:${pad(startM)}-${pad(hour)}:${pad(minute)}`;
    };
    // I-IV
    for (let i = 0; i < 4; i++) slots.push(add(classDurationMinutes));
    // Lunch 60m
    const lunchStartH = hour, lunchStartM = minute;
    minute += 60;
    while (minute >= 60) { minute -= 60; hour += 1; }
    const lunchLabel = `${pad(lunchStartH)}:${pad(lunchStartM)} - ${pad(hour)}:${pad(minute)}`;
    // V (lunch) placeholder; we won't render from slots for lunch label, use computed label
    slots.push(lunchLabel);
    // VI-VIII
    for (let i = 0; i < 3; i++) slots.push(add(classDurationMinutes));
    return slots;
  };
  const TIME_SLOTS = computeTimeSlots();

  const handleSave = () =>
    toast({ title: "Timetable Saved", description: "Your timetable is saved!" });

  const handleExportPDF = () =>
    toast({ title: "Export Started", description: "Generating PDF..." });

  const handleExportCSV = () =>
    toast({ title: "Export Started", description: "Generating CSV..." });

  const handleExportImage = async () => {
    try {
      const node = document.getElementById("timetable-capture");
      if (!node) {
        toast({ title: "Export Failed", description: "Timetable not found.", variant: "destructive" });
        return;
      }
      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "timetable.png";
      link.href = dataUrl;
      link.click();
      try {
        localStorage.setItem("timetable_image", dataUrl);
      } catch {}
      toast({ title: "Exported", description: "Timetable saved as image." });
    } catch (e) {
      toast({ title: "Export Failed", description: "Could not export image.", variant: "destructive" });
    }
  };

  const isLunch = (day, period) => !!timetableData[day]?.[period]?.isLunch;

  const handleDragStart = (day, period, e) => {
    if (isLunch(day, period)) return;
    try {
      e?.dataTransfer?.setData("text/plain", `${day}-${period}`);
      if (e?.dataTransfer) e.dataTransfer.effectAllowed = "move";
    } catch {}
    setDragSource({ day, period });
  };

  const handleDragOver = (e, day, period) => {
    if (isLunch(day, period)) return;
    e.preventDefault();
    try {
      if (e?.dataTransfer) e.dataTransfer.dropEffect = "move";
    } catch {}
    setDragOverKey(`${day}-${period}`);
  };

  const handleDragEnter = (day, period) => {
    if (isLunch(day, period)) return;
    setDragOverKey(`${day}-${period}`);
  };

  const handleDragLeave = (day, period) => {
    const key = `${day}-${period}`;
    if (dragOverKey === key) setDragOverKey(null);
  };

  const handleDrop = (e, day, period) => {
    e?.preventDefault?.();
    const targetKey = `${day}-${period}`;
    setDragOverKey(null);
    let source = dragSource;
    if (!source) {
      try {
        const data = e?.dataTransfer?.getData("text/plain");
        if (data && data.includes("-")) {
          const [sDay, sPeriod] = data.split("-");
          source = { day: sDay, period: sPeriod };
        }
      } catch {}
    }
    if (!source) return;
    if (isLunch(day, period)) {
      toast({ title: "Not allowed", description: "Cannot drop onto lunch break.", variant: "destructive" });
      setDragSource(null);
      return;
    }
    const { day: srcDay, period: srcPeriod } = source;
    if (srcDay === day && srcPeriod === period) {
      setDragSource(null);
      return;
    }
    setTimetableData((prev) => {
      const next = { ...prev };
      // Same-day move: operate on a single row to avoid overwrites
      if (srcDay === day) {
        const row = { ...(next[srcDay] || {}) };
        const srcCell = row[srcPeriod] ? { ...row[srcPeriod] } : {};
        const dstCell = row[period] ? { ...row[period] } : {};
        if (dstCell.isLunch) return prev;
        const destinationHasSubject = !!dstCell.subject;
        row[period] = srcCell;
        row[srcPeriod] = destinationHasSubject ? dstCell : {};
        return { ...next, [srcDay]: row };
      }
      // Cross-day move: update two independent rows
      const nextSrcRow = { ...(next[srcDay] || {}) };
      const nextDstRow = { ...(next[day] || {}) };
      const srcCell = nextSrcRow[srcPeriod] ? { ...nextSrcRow[srcPeriod] } : {};
      const dstCell = nextDstRow[period] ? { ...nextDstRow[period] } : {};
      if (dstCell.isLunch) return prev;
      const destinationHasSubject = !!dstCell.subject;
      nextDstRow[period] = srcCell;
      nextSrcRow[srcPeriod] = destinationHasSubject ? dstCell : {};
      return { ...next, [srcDay]: nextSrcRow, [day]: nextDstRow };
    });
    setDragSource(null);
  };

  const handleDragEnd = () => {
    setDragOverKey(null);
  };

  const renderCell = (day, period) => {
    const cell = timetableData[day]?.[period];
    if (!cell || (!cell.subject && !cell.isLunch)) {
      return (
        <div
          className={`p-2 h-20 border border-dashed border-muted-foreground/30 rounded flex items-center justify-center ${
            dragOverKey === `${day}-${period}` ? "ring-2 ring-primary/60" : ""
          }`}
          draggable={false}
          onDragOver={(e) => handleDragOver(e, day, period)}
          onDragEnter={() => handleDragEnter(day, period)}
          onDragLeave={() => handleDragLeave(day, period)}
          onDrop={(e) => handleDrop(e, day, period)}
        >
          <span className="text-xs text-muted-foreground">Free</span>
        </div>
      );
    }

    if (cell.isLunch) {
      return (
        <div className="p-2 h-20 bg-muted rounded flex flex-col items-center justify-center">
          <span className="font-medium text-sm">LUNCH BREAK</span>
          <span className="text-xs text-muted-foreground">{TIME_SLOTS[4]}</span>
        </div>
      );
    }

    return (
      <div
        className={`p-2 h-20 border rounded ${
          cell.color || "bg-card"
        } flex flex-col justify-between text-xs`}
        draggable={true}
        onDragStart={(e) => handleDragStart(day, period, e)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, day, period)}
        onDragEnter={() => handleDragEnter(day, period)}
        onDragLeave={() => handleDragLeave(day, period)}
        onDrop={(e) => handleDrop(e, day, period)}
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
            <Button variant="outline" size="sm" onClick={handleExportImage}>
              <Download className="h-4 w-4 mr-2" /> Image
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        <Card className="shadow-elevated mb-8 bg-gradient-card backdrop-blur border border-white/10" id="timetable-capture">
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
                      <div
                        key={`${day}-${p}`}
                        className="min-h-[80px]"
                      >
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
                        {subj.faculties[0] ? (
                          <Link
                            to="/faculty"
                            state={{
                              faculty: subj.faculties[0],
                              timetableData,
                              classDurationMinutes,
                              subjects,
                            }}
                            className="underline underline-offset-2 hover:text-primary"
                          >
                            {subj.faculties[0]}
                          </Link>
                        ) : (
                          "TBA"
                        )}
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