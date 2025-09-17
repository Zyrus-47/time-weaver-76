import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Calendar, Clock, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateTimetable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    classrooms: 5,
    batches: 3,
    maxClassesPerDay: 8,
    avgFacultyLeaves: 2,
    breakDuration: 60,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    classDurationMinutes: 50
  });

  const [subjects, setSubjects] = useState([
    { id: '1', name: '', code: '', priority: 'medium', classesPerWeek: 4, faculties: [''] }
  ]);

  const [specialClasses, setSpecialClasses] = useState([]);
  const [events, setEvents] = useState('');

  const addSubject = () => {
    const newSubject = {
      id: Date.now().toString(),
      name: '',
      code: '',
      priority: 'medium',
      classesPerWeek: 4,
      faculties: ['']
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const addFaculty = (subjectId) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, faculties: [...subject.faculties, ''] }
        : subject
    ));
  };

  const removeFaculty = (subjectId, facultyIndex) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, faculties: subject.faculties.filter((_, index) => index !== facultyIndex) }
        : subject
    ));
  };

  const updateFaculty = (subjectId, facultyIndex, value) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { 
            ...subject, 
            faculties: subject.faculties.map((faculty, index) => 
              index === facultyIndex ? value : faculty
            )
          }
        : subject
    ));
  };

  const addSpecialClass = () => {
    const newSpecialClass = {
      id: Date.now().toString(),
      name: '',
      day: '',
      period: '',
      venue: ''
    };
    setSpecialClasses([...specialClasses, newSpecialClass]);
  };

  const removeSpecialClass = (id) => {
    setSpecialClasses(specialClasses.filter(sc => sc.id !== id));
  };

  const updateSpecialClass = (id, field, value) => {
    setSpecialClasses(specialClasses.map(sc => 
      sc.id === id ? { ...sc, [field]: value } : sc
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const isValid = subjects.every(subject => 
      subject.name.trim() && subject.code.trim() && 
      subject.faculties.every(faculty => faculty.trim())
    );

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all subject details and faculty names.",
        variant: "destructive"
      });
      return;
    }

    // Generate timetable data
    const timetableData = {
      formData,
      subjects: subjects.filter(s => s.name.trim()),
      specialClasses,
      events
    };

    // For now, navigate to a results page with the data
    // In a real app, this would call an API
    navigate('/timetable', { state: timetableData });
    
    toast({
      title: "Success!",
      description: "Timetable generated successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your <span className="bg-gradient-primary bg-clip-text text-transparent">Timetable</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Fill in the details below to generate your optimized class schedule
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Configuration */}
          <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Basic Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="classrooms">Number of Classrooms</Label>
                  <Input
                    id="classrooms"
                    type="number"
                    min="1"
                    value={formData.classrooms}
                    onChange={(e) => setFormData({...formData, classrooms: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="classDurationMinutes">Class Duration (minutes)</Label>
                  <Input
                    id="classDurationMinutes"
                    type="number"
                    min="30"
                    max="180"
                    value={formData.classDurationMinutes}
                    onChange={(e) => setFormData({...formData, classDurationMinutes: parseInt(e.target.value || '50') || 50})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="batches">Number of Batches</Label>
                  <Input
                    id="batches"
                    type="number"
                    min="1"
                    value={formData.batches}
                    onChange={(e) => setFormData({...formData, batches: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxClasses">Max Classes Per Day</Label>
                  <Input
                    id="maxClasses"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.maxClassesPerDay}
                    onChange={(e) => setFormData({...formData, maxClassesPerDay: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="leaves">Avg Faculty Leaves/Month</Label>
                  <Input
                    id="leaves"
                    type="number"
                    min="0"
                    value={formData.avgFacultyLeaves}
                    onChange={(e) => setFormData({...formData, avgFacultyLeaves: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subjects Configuration */}
          <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Subjects & Faculty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="p-4 border rounded-lg space-y-4 bg-card/50 backdrop-blur">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Subject {index + 1}</h4>
                    {subjects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(subject.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Subject Name</Label>
                      <Input
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        placeholder="e.g., Mathematics"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Subject Code</Label>
                      <Input
                        value={subject.code}
                        onChange={(e) => updateSubject(subject.id, 'code', e.target.value)}
                        placeholder="e.g., MATH101"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={subject.priority}
                        onValueChange={(value) => 
                          updateSubject(subject.id, 'priority', value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Classes Per Week</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={subject.classesPerWeek}
                      onChange={(e) => updateSubject(subject.id, 'classesPerWeek', parseInt(e.target.value))}
                      className="mt-1 max-w-xs"
                    />
                  </div>

                  <div>
                    <Label>Faculty Members</Label>
                    <div className="space-y-2 mt-1">
                      {subject.faculties.map((faculty, facultyIndex) => (
                        <div key={facultyIndex} className="flex gap-2">
                          <Input
                            value={faculty}
                            onChange={(e) => updateFaculty(subject.id, facultyIndex, e.target.value)}
                            placeholder="Faculty name"
                          />
                          {subject.faculties.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFaculty(subject.id, facultyIndex)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addFaculty(subject.id)}
                        className="text-primary hover:text-primary"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Faculty
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addSubject}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </CardContent>
          </Card>

          {/* Break Schedule */}
          <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Break Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    min="15"
                    max="120"
                    value={formData.breakDuration}
                    onChange={(e) => setFormData({...formData, breakDuration: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lunchStart">Lunch Break Start</Label>
                  <Input
                    id="lunchStart"
                    type="time"
                    value={formData.lunchBreakStart}
                    onChange={(e) => setFormData({...formData, lunchBreakStart: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lunchEnd">Lunch Break End</Label>
                  <Input
                    id="lunchEnd"
                    type="time"
                    value={formData.lunchBreakEnd}
                    onChange={(e) => setFormData({...formData, lunchBreakEnd: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Classes */}
          <Card className="shadow-card bg-gradient-card backdrop-blur border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Special Classes & Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {specialClasses.length > 0 && (
                <div className="space-y-4">
                  {specialClasses.map((specialClass) => (
                    <div key={specialClass.id} className="p-4 border rounded-lg bg-card/50 backdrop-blur">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Special Class</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpecialClass(specialClass.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <Label>Class Name</Label>
                          <Input
                            value={specialClass.name}
                            onChange={(e) => updateSpecialClass(specialClass.id, 'name', e.target.value)}
                            placeholder="e.g., Lab Session"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Day</Label>
                          <Select
                            value={specialClass.day}
                            onValueChange={(value) => updateSpecialClass(specialClass.id, 'day', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Period</Label>
                          <Input
                            value={specialClass.period}
                            onChange={(e) => updateSpecialClass(specialClass.id, 'period', e.target.value)}
                            placeholder="e.g., Period I"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Venue</Label>
                          <Input
                            value={specialClass.venue}
                            onChange={(e) => updateSpecialClass(specialClass.id, 'venue', e.target.value)}
                            placeholder="e.g., Lab 1"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={addSpecialClass}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Special Class
              </Button>
              
              <Separator />
              
              <div>
                <Label htmlFor="events">Events & Workshops</Label>
                <Textarea
                  id="events"
                  value={events}
                  onChange={(e) => setEvents(e.target.value)}
                  placeholder="Enter any special events, workshops, or occasions (one per line)"
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-primary hover:opacity-95 px-12 py-6 text-lg shadow-md"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Generate Timetable
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTimetable;