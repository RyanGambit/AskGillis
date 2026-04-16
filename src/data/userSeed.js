// All 59 Gillis users - used for dev mode impersonation and reference
// This mirrors the user_seed table in Supabase

export const PODS = [
  { id: 'executive_team', name: 'Executive Team', parentPodId: null, leaderEmail: 'tgillis@gillissales.com' },
  { id: 'kanina_pod', name: 'Kanina Pod', parentPodId: null, leaderEmail: 'kbrinkey@gillissales.com' },
  { id: 'katie_pod', name: 'Katie Pod', parentPodId: null, leaderEmail: 'kgarrett@gillissales.com' },
  { id: 'tracy_pod', name: 'Tracy Pod', parentPodId: 'katie_pod', leaderEmail: 'tmorris@gillissales.com' },
  { id: 'brady_pod', name: 'Brady Pod', parentPodId: 'katie_pod', leaderEmail: 'barmstrong@gillissales.com' },
  { id: 'lili_pod', name: 'Lili Pod', parentPodId: null, leaderEmail: 'lmatias@gillissales.com' },
  { id: 'nikki_ops_pod', name: 'Nikki Ops Pod', parentPodId: null, leaderEmail: 'nsharpley@gillissales.com' },
  { id: 'paula_pod', name: 'Paula Pod', parentPodId: 'nikki_ops_pod', leaderEmail: 'pjamieson@gillissales.com' },
  { id: 'laura_pod', name: 'Laura Pod', parentPodId: 'nikki_ops_pod', leaderEmail: 'lpayne@gillissales.com' },
];

export const USERS = [
  // Executives (4)
  { email: 'tgillis@gillissales.com', fullName: 'Tammy Gillis', title: 'CEO and Founder', role: 'executive', podId: 'executive_team', manages: ['executive_team'] },
  { email: 'agirodat@gillissales.com', fullName: 'Aimee Girodat', title: 'VP of Sales Performance', role: 'executive', podId: 'executive_team', manages: null },
  { email: 'nsharpley@gillissales.com', fullName: 'Nikki Sharpley', title: 'VP of Operations', role: 'executive', podId: 'executive_team', manages: ['nikki_ops_pod'] },
  { email: 'sstrobusch@gillissales.com', fullName: 'Shannon Strobusch', title: 'VP of Business Development', role: 'executive', podId: 'executive_team', manages: null },

  // Leaders (8)
  { email: 'kbrinkey@gillissales.com', fullName: 'Kanina Brinkey', title: 'Executive Director of Sales Performance', role: 'leader', podId: 'kanina_pod', manages: ['kanina_pod'] },
  { email: 'kgarrett@gillissales.com', fullName: 'Katie Garrett', title: 'Sr. Executive Director of Sales', role: 'leader', podId: 'katie_pod', manages: ['katie_pod'] },
  { email: 'tmorris@gillissales.com', fullName: 'Tracy Morris', title: 'Executive Director of Sales Performance', role: 'leader', podId: 'tracy_pod', manages: ['tracy_pod'] },
  { email: 'barmstrong@gillissales.com', fullName: 'Brady Armstrong', title: 'Senior Regional Director of Sales', role: 'leader', podId: 'brady_pod', manages: ['brady_pod'] },
  { email: 'lmatias@gillissales.com', fullName: 'Lili Matias', title: 'Executive Director of Sales Performance', role: 'leader', podId: 'lili_pod', manages: ['lili_pod'] },
  { email: 'pjamieson@gillissales.com', fullName: 'Paula Jamieson', title: 'National Director of Sales', role: 'leader', podId: 'paula_pod', manages: ['paula_pod'] },
  { email: 'lpayne@gillissales.com', fullName: 'Laura Payne', title: 'National Director of Sales', role: 'leader', podId: 'laura_pod', manages: ['laura_pod'] },
  { email: 'bcarlson@gillissales.com', fullName: 'Bianca Carlson', title: 'Training Facilitator', role: 'leader', podId: 'executive_team', manages: null },

  // Sellers - Kanina Pod (6)
  { email: 'aeysallenne@gillissales.com', fullName: 'Ariel Eysallenne', title: 'Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'jpeperfelty@gillissales.com', fullName: 'Jennifer Peper-Felty', title: 'Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'cgonzalez@gillissales.com', fullName: 'Cindy Gonzalez', title: 'Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'ascott@gillissales.com', fullName: 'Alexa Scott', title: 'Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'ajansen@gillissales.com', fullName: 'Amber Jansen', title: 'Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'kthompson@gillissales.com', fullName: 'Kimberly Thompson', title: 'Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },

  // Sellers - Katie Pod (4)
  { email: 'wdavilahill@gillissales.com', fullName: 'Wendy Davila Hill', title: 'Regional Director of Sales', role: 'seller', podId: 'katie_pod', manages: null },
  { email: 'lely@gillissales.com', fullName: 'Linda Ely', title: 'Regional Director of Sales', role: 'seller', podId: 'katie_pod', manages: null },
  { email: 'dfavel@gillissales.com', fullName: 'Darin Favel', title: 'Regional Director of Sales', role: 'seller', podId: 'katie_pod', manages: null },
  { email: 'jbelval@gillissales.com', fullName: 'Jules Belval', title: 'Senior Regional Director of Sales', role: 'seller', podId: 'katie_pod', manages: null },

  // Sellers - Tracy Pod (1)
  { email: 'kking@gillissales.com', fullName: 'KayLou King', title: 'Senior Regional Director of Sales', role: 'seller', podId: 'tracy_pod', manages: null },

  // Sellers - Brady Pod (6)
  { email: 'kbradley@gillissales.com', fullName: 'Kim Bradley', title: 'Regional Director of Sales', role: 'seller', podId: 'brady_pod', manages: null },
  { email: 'smcnaughton@gillissales.com', fullName: 'Stacey McNaughton', title: 'Regional Director of Sales', role: 'seller', podId: 'brady_pod', manages: null },
  { email: 'khall@gillissales.com', fullName: 'Kay Hall', title: 'Regional Director of Sales', role: 'seller', podId: 'brady_pod', manages: null },
  { email: 'jtyre@gillissales.com', fullName: 'Jessica Tyre', title: 'Regional Director of Sales', role: 'seller', podId: 'brady_pod', manages: null },
  { email: 'tjones@gillissales.com', fullName: 'Taylor Jones', title: 'Regional Director of Sales', role: 'seller', podId: 'brady_pod', manages: null },
  { email: 'cwillis@gillissales.com', fullName: 'Cassie Willis', title: 'Regional Director of Sales', role: 'seller', podId: 'brady_pod', manages: null },

  // Sellers - Lili Pod (12)
  { email: 'pkerfont@gillissales.com', fullName: 'Paul Kerfont', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'gpatterson@gillissales.com', fullName: 'Geri Patterson', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'ksmith@gillissales.com', fullName: 'Kristi Smith', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'kbennett@gillissales.com', fullName: 'Kenzle Bennett', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'sbroderick@gillissales.com', fullName: 'Suzan Broderick', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'rcohen@gillissales.com', fullName: 'Rebecca Cohen', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'ndaly@gillissales.com', fullName: 'Natalie Daly', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'jjones@gillissales.com', fullName: 'Janae Jones', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'hschimizzi@gillissales.com', fullName: 'Haley Schimizzi', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'jtirocke@gillissales.com', fullName: 'Jodi Tirocke', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'bwilbourn@gillissales.com', fullName: 'Bekah Wilbourn', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'bduchessi@gillissales.com', fullName: 'Bethany Duchessi', title: 'Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },

  // Sellers - Nikki Ops Pod (7)
  { email: 'aauvil@gillissales.com', fullName: 'Ashley Auvil', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'lmcneill@gillissales.com', fullName: 'Lachelle McNeill', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'lelmo@gillissales.com', fullName: 'Lynsey Elmo', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'mhibner@gillissales.com', fullName: 'Monica Hibner', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'cverdin@gillissales.com', fullName: 'Connie Verdin', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'gzanniflorian@gillissales.com', fullName: 'Gina Zannie-Florian', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'slen@gillissales.com', fullName: 'Serena Len', title: 'Regional Director of Sales', role: 'seller', podId: 'nikki_ops_pod', manages: null },

  // Operations Support (seller access) (6)
  { email: 'tmclean@gillissales.com', fullName: 'Terri McLean', title: 'Dynamic Strategy Analyst', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'hmorgan@gillissales.com', fullName: 'Heather Morgan', title: 'Dynamic Strategy Analyst', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'ltews@gillissales.com', fullName: 'Laura Tews', title: 'Sales Specialist', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'bstephenson@gillissales.com', fullName: 'Brandon Stephenson', title: 'Client Program Coordinator', role: 'seller', podId: 'executive_team', manages: null },
  { email: 'ngillespie@gillissales.com', fullName: 'Nicole Gillespie', title: 'People and Culture Specialist', role: 'seller', podId: 'executive_team', manages: null },
  { email: 'twilkinson@gillissales.com', fullName: 'Taylor Wilkinson', title: 'Talent Coordinator', role: 'seller', podId: 'executive_team', manages: null },

  // Admin (3)
  { email: 'talmond@gillissales.com', fullName: 'Tysha Almond', title: 'Business Analyst, Operations', role: 'admin', podId: null, manages: null },
  { email: 'kemmons@gillissales.com', fullName: 'Kevin Emmons', title: 'Salesforce Administrator', role: 'admin', podId: null, manages: null },
  { email: 'achristy@gillissales.com', fullName: 'Alissa Christy', title: 'Manager, New Client Implementation', role: 'admin', podId: null, manages: null },

  // No Access (2)
  { email: 'abernal@gillissales.com', fullName: 'Alexandra Bernal', title: 'Senior Finance Administrator', role: 'none', podId: null, manages: null },
  { email: 'jenllokbo@gillissales.com', fullName: 'Josephine Enllokbo', title: 'Accounting and Administrative', role: 'none', podId: null, manages: null },
];

// Helper: get all child pod IDs (recursive)
export function getVisiblePodIds(manages, allPods = PODS) {
  if (!manages || manages.length === 0) return [];
  const result = new Set(manages);
  const addChildren = (parentId) => {
    allPods.forEach(p => {
      if (p.parentPodId === parentId && !result.has(p.id)) {
        result.add(p.id);
        addChildren(p.id);
      }
    });
  };
  manages.forEach(addChildren);
  return [...result];
}

// Helper: get pod members
export function getPodMembers(podIds) {
  return USERS.filter(u => u.role === 'seller' && podIds.includes(u.podId));
}

// Helper: find user by email
export function findUser(email) {
  return USERS.find(u => u.email === email);
}
