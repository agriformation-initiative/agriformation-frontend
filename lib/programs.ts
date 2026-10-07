export interface Program {
  title: string;
  short: string;
  timeline: string;
  timelineLong: string;
  description: string;
  impact: string;
  activities: string[];
  image: string;
}

/** Built-in defaults. The live content comes from the admin (see lib/settings.ts) and falls back to these. */
export const DEFAULT_PROGRAMS: Program[] = [
  {
    title: 'School Gardens & Agri-Clubs',
    short:
      'Demonstration gardens in 10 schools, with Agri-Clubs running hands-on activities, mini-lectures and competitions.',
    timeline: 'Sept to Dec 2025',
    timelineLong: 'September to December 2025',
    description:
      'We establish demonstration gardens in up to 5 schools, introducing diverse crops including vegetables, herbs and spices. Our Agri-Clubs run mini-lectures, competitions and storytelling sessions.',
    impact: 'Hands-on learning, student ownership and pride in agriculture.',
    activities: [
      'Setting up school demonstration plots',
      'Weekly Agri-Club meetings with practical activities',
      'Student-led garden projects',
      'Competitions and exhibitions',
    ],
    image: '/images/group.jpg',
  },
  {
    title: 'Teacher Training & Awareness Week',
    short:
      'Teachers trained as Agri-Champions, an Agri Awareness Week with debates and exhibitions, and parents engaged as allies.',
    timeline: 'Jan to Apr 2026',
    timelineLong: 'January to April 2026',
    description:
      'We expand gardens to 5 more schools (10 in total), host Agri Awareness Week with debates and exhibitions, and train teachers as Agri-Champions who mentor students and manage gardens.',
    impact: 'Teachers and parents become allies, and students explore career paths.',
    activities: [
      'Training teachers as agricultural mentors',
      'School-wide awareness campaigns',
      'Career talks from agricultural professionals',
      'Community Day with parents and farmers',
    ],
    image: '/images/teacher.jpg',
  },
  {
    title: 'Farm Excursions & Youth Workshops',
    short:
      'Taking 500 students to modern farms and teaching agri-business skills and sustainable practice.',
    timeline: 'Apr to Jul 2026',
    timelineLong: 'April to July 2026',
    description:
      'Students visit modern farms to see poultry, greenhouses and agro-processing. Our Youth Agri-Workshop reaches 500 students with skills in agri-business basics and sustainability.',
    impact: 'Students connect classroom learning to real-world opportunities.',
    activities: [
      'Guided tours of integrated farms',
      'Workshops on modern farming techniques',
      'Agri-business and entrepreneurship training',
      'Student garden project showcases',
    ],
    image: '/images/excursion1.jpg',
  },
  {
    title: 'Summer Internship Linkages',
    short:
      'Matching students with farms and agribusinesses for practical experience, mentorship and exposure to agri-tech.',
    timeline: 'Aug 2026',
    timelineLong: 'August 2026',
    description:
      'We match students to farms and agribusinesses for free or subsidised internships, giving them exposure to real jobs, agricultural technology and entrepreneurship.',
    impact: 'Students gain practical experience, networks and mentorship.',
    activities: [
      'Matching students with host organisations',
      'Structured internship programmes',
      'Mentorship from industry professionals',
      'Career pathway guidance',
    ],
    image: '/images/happy-students.jpg',
  },
];

/** Photos for programs, by position. Programs added in the admin beyond these use the last one. */
export const PROGRAM_IMAGES = DEFAULT_PROGRAMS.map((p) => p.image);
