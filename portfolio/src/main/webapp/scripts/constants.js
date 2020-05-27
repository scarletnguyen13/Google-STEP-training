const GOOGLE_COLORS = ['#f4c20d', '#4885ed', '#3cba54'] // yellow, blue, green
const BACKGROUND_RANDOM_COLORS = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
const ICONS = ['contact', 'code', 'education', 'me', 'work', 'achievement'];

const NUMBER_OF_BACKGROUND_BALLS = 50;

const FULL_CIRCLE_DEGREE = 360;
const NUMBER_OF_SATELLITE = ICONS.length;
const MENU_RADIUS = 250;
const SATELLITE_RADIUS = 90; // as specified in CSS (90px);

const CONTACT = {
  'github': 'https://github.com/scarletnguyen13',
  'linkedin': 'https://www.linkedin.com/in/scarletnguyen/',
  'resume': '../docs/resume.pdf',
  'email': 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=' +
           'scarlet.nguyen01@gmail.com',
  'facebook': 'https://www.facebook.com/scarletnguyen13',
  'instagram': 'https://www.instagram.com/scarletnguyen13_/',
  'cbc': 'https://www.cbc.ca/news/canada/british-columbia/' +
         'teen-hackathon-winner-app-female-students-tech-industry-1.4902520'
}

export { 
  GOOGLE_COLORS,
  BACKGROUND_RANDOM_COLORS,
  ICONS,
  NUMBER_OF_BACKGROUND_BALLS,
  FULL_CIRCLE_DEGREE, 
  NUMBER_OF_SATELLITE, 
  MENU_RADIUS, 
  SATELLITE_RADIUS,
  CONTACT,
}