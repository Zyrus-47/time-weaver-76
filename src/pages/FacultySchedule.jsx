import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const FacultySchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const faculty = location.state?.faculty;
  const timetableData = location.state?.timetableData || {};
  const classDurationMinutes = location.state?.classDurationMinutes || 50;

  if (!faculty) {
    navigate("/timetable");
    return null;
  }

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  const computeTimeSlots = () => {
    let hour = 9;
    let minute = 0;
    const slots = [];
    const add = (mins) => {
      const startH = hour, startM = minute;
      minute += mins;
      while (minute >= 60) { minute -= 60; hour += 1; }
      return `${pad(startH)}:${pad(startM)}-${pad(hour)}:${pad(minute)}`;
    };
    for (let i = 0; i < 4; i++) slots.push(add(classDurationMinutes));
    const lunchStartH = hour, lunchStartM = minute;
    minute += 60;
    while (minute >= 60) { minute -= 60; hour += 1; }
    slots.push(`${pad(lunchStartH)}:${pad(lunchStartM)} - ${pad(hour)}:${pad(minute)}`);
    for (let i = 0; i < 3; i++) slots.push(add(classDurationMinutes));
    return slots;
  };
  const TIME_SLOTS = computeTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{faculty}'s Weekly Classes</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>
        <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-9 gap-1 p-4 bg-muted/50">
                  <div className="font-semibold text-center py-2">Day/Period</div>
                  {PERIODS.map((p, i) => (
                    <div key={p} className="font-semibold text-center py-2">
                      <div>{p}</div>
                      <div className="text-xs text-muted-foreground font-normal">{TIME_SLOTS[i]}</div>
                    </div>
                  ))}
                </div>
                {DAYS.map((day) => (
                  <div key={day} className="grid grid-cols-9 gap-1 p-4 border-t">
                    <div className="font-medium flex items-center justify-center bg-card/70 backdrop-blur rounded py-2">{day}</div>
                    {PERIODS.map((p) => {
                      const cell = timetableData[day]?.[p];
                      const show = cell?.faculty === faculty || cell?.isLunch;
                      return (
                        <div key={`${day}-${p}`} className="min-h-[80px]">
                          {cell?.isLunch ? (
                            <div className="p-2 h-20 bg-muted rounded flex flex-col items-center justify-center">
                              <span className="font-medium text-sm">LUNCH</span>
                              <span className="text-xs text-muted-foreground">{TIME_SLOTS[4]}</span>
                            </div>
                          ) : show ? (
                            <div className={`p-2 h-20 border rounded ${cell?.color || "bg-card"} flex flex-col justify-between text-xs`}>
                              <div>
                                <div className="font-medium truncate">{cell?.code}</div>
                                <div className="truncate">{cell?.subject}</div>
                              </div>
                              <div className="text-xs opacity-75">
                                <div className="truncate">{cell?.faculty}</div>
                                <div className="truncate">{cell?.venue}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 h-20 border border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">—</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FacultySchedule;


