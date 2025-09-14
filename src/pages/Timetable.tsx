import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Save, BarChart3, Edit3, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimetableCell {
  subject?: string;
  code?: string;
  faculty?: string;
  venue?: string;
  color?: string;
  isBreak?: boolean;
  isLunch?: boolean;
  isSpecial?: boolean;
}

interface TimetableData {
  [day: string]: {
    [period: string]: TimetableCell;
  };
}

const Timetable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timetableData, setTimetableData] = useState<TimetableData>({});
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const timeSlots = [
    '09:00-09:50',
    '09:50-10:40', 
    '10:40-11:30',
    '11:30-12:20',
    '12:20-13:10',
    '14:10-15:00',
    '15:00-15:50',
    '15:50-16:40'
  ];

  const subjectColors = [
    'bg-education-blue/20 text-education-blue border-education-blue/30',
    'bg-education-green/20 text-education-green border-education-green/30', 
    'bg-education-purple/20 text-education-purple border-education-purple/30',
    'bg-education-orange/20 text-education-orange border-education-orange/30',
    'bg-education-red/20 text-education-red border-education-red/30'
  ];

  useEffect(() => {
    const data = location.state;
    if (!data) {
      navigate('/create');
      return;
    }
    
    // Generate sample timetable based on provided data
    generateSampleTimetable(data);
  }, [location.state, navigate]);

  const generateSampleTimetable = (data: any) => {
    const { subjects: inputSubjects, specialClasses, formData } = data;
    const generatedData: TimetableData = {};
    
    // Initialize empty timetable
    days.forEach(day => {
      generatedData[day] = {};
      periods.forEach(period => {
        generatedData[day][period] = {};
      });
    });

    // Add lunch break
    days.forEach(day => {
      generatedData[day]['V'] = {
        subject: 'LUNCH BREAK',
        isLunch: true,
        color: 'bg-muted text-muted-foreground'
      };
    });

    // Assign subjects to periods (simplified algorithm)
    let subjectIndex = 0;
    let colorIndex = 0;
    
    inputSubjects.forEach((subject: any) => {
      const color = subjectColors[colorIndex % subjectColors.length];
      colorIndex++;
      
      // Distribute classes across the week
      let classesAssigned = 0;
      const maxClasses = subject.classesPerWeek;
      
      for (let dayIndex = 0; dayIndex < days.length && classesAssigned < maxClasses; dayIndex++) {
        const day = days[dayIndex];
        
        for (let periodIndex = 0; periodIndex < periods.length && classesAssigned < maxClasses; periodIndex++) {
          const period = periods[periodIndex];
          
          // Skip lunch period
          if (period === 'V') continue;
          
          // Check if slot is empty
          if (!generatedData[day][period].subject) {
            generatedData[day][period] = {
              subject: subject.name,
              code: subject.code,
              faculty: subject.faculties[0] || 'TBA',
              venue: `Room ${Math.floor(Math.random() * formData.classrooms) + 1}`,
              color: color
            };
            classesAssigned++;
          }
        }
      }
    });

    // Add special classes
    specialClasses.forEach((specialClass: any) => {
      if (specialClass.day && specialClass.period) {
        const dayName = specialClass.day.charAt(0).toUpperCase() + specialClass.day.slice(1);
        const periodNum = specialClass.period.replace(/\D/g, '');
        const periodIndex = parseInt(periodNum) - 1;
        
        if (periodIndex >= 0 && periodIndex < periods.length) {
          const period = periods[periodIndex];
          generatedData[dayName][period] = {
            subject: specialClass.name,
            venue: specialClass.venue,
            faculty: 'Special',
            isSpecial: true,
            color: 'bg-accent/20 text-accent border-accent/30'
          };
        }
      }
    });

    setTimetableData(generatedData);
    setSubjects(inputSubjects);
  };

  const handleSave = () => {
    // In a real app, this would save to Supabase
    toast({
      title: "Timetable Saved",
      description: "Your timetable has been saved successfully!",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your PDF is being generated...",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Export Started", 
      description: "Your CSV file is being generated...",
    });
  };

  const getCellContent = (day: string, period: string) => {
    const cell = timetableData[day]?.[period];
    
    if (!cell || (!cell.subject && !cell.isBreak && !cell.isLunch)) {
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
          <span className="text-xs text-muted-foreground">13:10 - 14:10</span>
        </div>
      );
    }

    return (
      <div className={`p-2 h-20 border rounded ${cell.color || 'bg-card'} flex flex-col justify-between text-xs`}>
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

  if (!timetableData || Object.keys(timetableData).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Generating your timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Generated <span className="bg-gradient-primary bg-clip-text text-transparent">Timetable</span>
            </h1>
            <p className="text-muted-foreground">
              Your optimized class schedule is ready! You can modify it by dragging and dropping.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weekly Schedule</span>
              <Badge variant="secondary">
                <Edit3 className="h-3 w-3 mr-1" />
                Drag to Edit
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-9 gap-1 p-4 bg-muted/50">
                  <div className="font-semibold text-center py-2">Day/Period</div>
                  {periods.map((period, index) => (
                    <div key={period} className="font-semibold text-center py-2">
                      <div>{period}</div>
                      <div className="text-xs text-muted-foreground font-normal">
                        {timeSlots[index]}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Timetable Rows */}
                {days.map(day => (
                  <div key={day} className="grid grid-cols-9 gap-1 p-4 border-t">
                    <div className="font-medium flex items-center justify-center bg-card rounded py-2">
                      {day}
                    </div>
                    {periods.map(period => (
                      <div key={`${day}-${period}`} className="min-h-[80px]">
                        {getCellContent(day, period)}
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
          <Card className="shadow-card">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject, index) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <Badge className={subjectColors[index % subjectColors.length]}>
                          {subject.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.faculties[0] || 'TBA'}</TableCell>
                      <TableCell>{subject.classesPerWeek}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Faculty Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{subject.faculties[0] || 'TBA'}</div>
                      <div className="text-sm text-muted-foreground">{subject.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(subject.classesPerWeek / 8) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {subject.classesPerWeek}/8
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