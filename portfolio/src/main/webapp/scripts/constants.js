const GOOGLE_COLORS = ['#f4c20d', '#4885ed', '#3cba54'] // yellow, blue, green
const TAG_COLORS = ['#e6c445', '#7ba9f9', '#62cc78'];
const BACKGROUND_RANDOM_COLORS = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

const ICONS = ['contact', 'code', 'education', 'me', 'work', 'achievement'];
const HEADERS = ['Projects', 'Education', 'About', 'Experience', 'Achievement'];

const NUMBER_OF_BACKGROUND_BALLS = 50;

const FULL_CIRCLE_DEGREE = 360;
const MENU_RADIUS = 250;
const SATELLITE_RADIUS = 90;

const CONTACT = {
  'github': 'https://github.com/scarletnguyen13',
  'linkedin': 'https://www.linkedin.com/in/scarletnguyen/',
  'resume': '../docs/resume.pdf',
  'email': 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=' +
           'scarlet.nguyen01@gmail.com',
  'facebook': 'https://www.facebook.com/scarletnguyen13',
  'instagram': 'https://www.instagram.com/scarletnguyen13_/',
};

const CODE =  {
  "OneStep Shipping": ["a freight forwarder online platform"],
  "Skip": ["fullstack", "mongo", "expressjs", "react", "node", "firebase"],
  "Churchill School App": ["a general-communication app for multiple parties"],
  "Skip1": ["school administrators", "teachers", "students", "parents"],
  "Skip2": ["react", "react native", "firebase", "node", "expressjs"],
  "Teacher Distributed Schedule System": ["program distributes shifts for staffs and teachers"],
  "Skip3": ["based on different allocations and employment contracts"],
};

const PERSONAL_INFO = {
  "Basic": ["scarlet nguyen", "19 y/o", "randomly weird", "ambitious", "hard-working"],
  "Classification": [
    "vietnamese canadian", "social introvert", "coder by day, writer by night"
  ],
  "Easily fall in love with": [
    "sweet stuff", "puppies", "nature", "(occasionally) people with glasses"
  ],
  "Dislike": ["anyone who always complains but doesn't take action"]
};

const EDUCATION =  {
  "School": ["University of British Columbia", "Canada", "Grads of 2023"],
  "First-year Courses": ["CPSC 110", "CPSC 121", "CPSC 210"],
  "Self-taught Courses": ["Harvard CS50", "University of Washington CSE 142"],
  "Skip": ["UBC Software Development Micromasters"],
  "Highschool Courses": ["AP & IB Computer Science", "Programming 11 & 12"],
}

const EXPERIENCE =  {
  "Google": ["STEP Software Developer intern", "3 months"],
  "Hootsuite": ["Software Developer intern", "8 months", "first accepted female"],
  "Skip": ["scala", "play framework", "i18n", "graphqQL", "backend", "agile"],
  "Women in Tech World Organization": ["HR & Marketing intern", "13 months"],
  "Skip1": ["interview & onboarding guide", "content marketing", "UX & UI design"]
}

const ACHIEVEMENT = {
  "Programming School Challenge 2018": ["1st place", "tech lead", "team of 10 beginners"],
  "WiTWorld Hackathon 2018": ["1st place", "tech lead", "team of 6 adults", "mentor app"],
  "InnoHacks 2018": ["1st place", "designed oral health campaign @ Bolivia"],
  "Skip": ["hygiene supply package", "recycled plastic waste 3D printers"],
  "EduHacks 2018": ["3rd place", "designed a platform to explore passion"],
  "UBC MiniEnterprize 2017": ["finalist", "team of 5 students", "solved Uber case study"],
  "VFS Creative Break Contest 2017": ["finalist", "game design & development boothcamp"],
}

const CONTENTS = [CODE, EDUCATION, PERSONAL_INFO, EXPERIENCE, ACHIEVEMENT];

const DEFAULT_COMMENT_LIST_SIZE = 5;

export { 
  GOOGLE_COLORS,
  BACKGROUND_RANDOM_COLORS,
  ICONS,
  NUMBER_OF_BACKGROUND_BALLS,
  FULL_CIRCLE_DEGREE, 
  MENU_RADIUS, 
  SATELLITE_RADIUS,
  CONTACT,
  CONTENTS,
  TAG_COLORS,
  HEADERS,
  DEFAULT_COMMENT_LIST_SIZE
}