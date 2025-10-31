'use client';
import Link from "next/link";
import Image from "next/image";

export default function ProgramsPage() {

  return (
    <div className="bg-stone-50">
      <section className="pt-28 pb-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-widest text-green-800 font-semibold mb-5">2025-2026 Program Cycle</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight tracking-tight">
                Strategic Programs
              </h1>
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
                Four comprehensive initiatives designed to make agriculture exciting, respected, and rewarding for Nigerian students
              </p>
            </div>
          </div>

          <div className="space-y-24">
            {[
              {
                icon: '🌱',
                title: 'School Gardens & Agri-Clubs',
                timeline: 'September – December 2025',
                description: 'We establish demonstration gardens in up to 5 schools, introducing diverse crops including vegetables, herbs, and spices. Our Agri-Clubs run mini-lectures, competitions, and storytelling sessions.',
                impact: 'Hands-on learning, student ownership, and building pride in agriculture',
                activities: [
                  'Setting up school demonstration plots',
                  'Weekly Agri-Club meetings with practical activities',
                  'Student-led garden projects',
                  'Competitions and exhibitions'
                ],
                image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop'
              },
              {
                icon: '🎓',
                title: 'Agri Awareness Week & Teacher Training',
                timeline: 'January – April 2026',
                description: 'We expand gardens to 5 more schools (totaling 10), host Agri Awareness Week with debates and exhibitions, and train teachers as Agri-Champions who mentor students and manage gardens.',
                impact: 'Teachers and parents become allies, students explore career paths',
                activities: [
                  'Training teachers as agricultural mentors',
                  'Organizing school-wide awareness campaigns',
                  'Career talks from agricultural professionals',
                  'Community Day with parents and farmers'
                ],
                image: '/images/teacher.jpg'
              },
              {
                icon: '🚌',
                title: 'Excursions & Youth Agricultural Workshop',
                timeline: 'April – July 2026',
                description: 'Students visit modern farms to see poultry, greenhouses, and agro-processing facilities. Our Youth Agri-Workshop reaches 500 students with skills in agri-business basics and sustainability.',
                impact: 'Students connect classroom learning to real-world opportunities',
                activities: [
                  'Guided tours of integrated farms',
                  'Workshops on modern farming techniques',
                  'Agri-business and entrepreneurship training',
                  'Student garden project showcases'
                ],
                image: 'https://images.unsplash.com/photo-1748002951892-615a0503142d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWZyaWNhbiUyMHlvdXRoJTIwYWdyaWN1bHR1cmFsJTIwd29ya3Nob3B8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600'
              },
              {
                icon: '🤝',
                title: 'Summer Internship Linkages',
                timeline: 'August 2026',
                description: 'We match students to farms and agribusinesses for free or subsidized internships, providing exposure to real jobs, agricultural technology, and entrepreneurship opportunities.',
                impact: 'Students gain practical experience, networks, and mentorship',
                activities: [
                  'Matching students with host organizations',
                  'Structured internship programs',
                  'Mentorship from industry professionals',
                  'Career pathway guidance'
                ],
                image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop'
              }
            ].map((program, index) => (
              <div key={index} className="relative">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                  <div className={`lg:col-span-3 space-y-6 ${index % 2 === 1 ? 'lg:col-start-3' : ''}`}>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-4 border border-green-900/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        {program.timeline}
                      </div>
                      <div className="flex items-start gap-4 mb-5">
                        <div className="text-4xl leading-none pt-1">{program.icon}</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight tracking-tight">{program.title}</h2>
                      </div>
                      <p className="text-base md:text-lg text-stone-600 leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="bg-white border border-stone-200 rounded-sm p-6">
                        <h4 className="font-semibold text-stone-900 mb-3 text-sm uppercase tracking-wider">Key Activities</h4>
                        <ul className="space-y-2.5">
                          {program.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-3 text-stone-600 text-sm leading-relaxed">
                              <span className="text-green-700 font-bold">—</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-emerald-900/5 border border-emerald-900/10 rounded-sm p-6">
                        <h4 className="font-semibold text-green-900 mb-2 text-sm uppercase tracking-wider">Expected Impact</h4>
                        <p className="text-stone-700 text-sm leading-relaxed">{program.impact}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-xl shadow-stone-900/10 border border-stone-200 sticky top-24">
                      <Image 
                        src={program.image}
                        width={500}
                        height={500}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {index < 3 && (
                  <div className="mt-24 border-b border-stone-200"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-24 bg-green-900 text-white rounded-sm p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-5 leading-tight tracking-tight">Want to Support Our Programs?</h3>
              <p className="text-lg text-emerald-50 mb-8 leading-relaxed">
                Partner with us to bring these transformative programs to more schools across Nigeria
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link href='/volunteer'
                  className="px-6 py-3 bg-white text-emerald-900 rounded font-medium hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Volunteer
                </Link>
                <Link href='/partner'
                  className="px-6 py-3 bg-transparent text-white rounded font-medium border-2 border-white hover:bg-white/10 transition-colors"
                >
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}