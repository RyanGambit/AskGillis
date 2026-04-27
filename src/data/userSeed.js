// All Gillis users — used for dev mode impersonation and reference
// This mirrors the user_seed table in Supabase.
// Last updated: 2026-04-27 (Tammy's revised structure with Aimee Pod, no Brady Pod, deletions)

export const PODS = [
  // Top-level pods
  { id: 'executive_team', name: 'Executive Team', parentPodId: null, leaderEmail: 'tgillis@gillissales.com' },
  { id: 'aimee_pod',      name: 'Aimee Pod',      parentPodId: null, leaderEmail: 'agirodat@gillissales.com' },
  { id: 'nikki_ops_pod',  name: 'Nikki Ops Pod',  parentPodId: null, leaderEmail: 'nsharpley@gillissales.com' },

  // Sub-pods under Aimee
  { id: 'kanina_pod', name: 'Kanina Pod', parentPodId: 'aimee_pod', leaderEmail: 'kbrinkey@gillissales.com' },
  { id: 'katie_pod',  name: 'Katie Pod',  parentPodId: 'aimee_pod', leaderEmail: 'kgarrett@gillissales.com' },
  { id: 'lili_pod',   name: 'Lili Pod',   parentPodId: 'aimee_pod', leaderEmail: 'lmatias@gillissales.com' },
  { id: 'paula_pod',  name: 'Paula Pod',  parentPodId: 'aimee_pod', leaderEmail: 'pjamieson@gillissales.com' },
  { id: 'laura_pod',  name: 'Laura Pod',  parentPodId: 'aimee_pod', leaderEmail: 'lpayne@gillissales.com' },

  // Tracy Pod sits under Katie Pod
  { id: 'tracy_pod', name: 'Tracy Pod', parentPodId: 'katie_pod', leaderEmail: 'tmorris@gillissales.com' },
];

export const USERS = [
  // ===== Executives (4) =====
  { email: 'tgillis@gillissales.com',    fullName: 'Tammy Gillis',       title: 'CEO and Founder',                 role: 'executive', podId: 'executive_team', manages: ['executive_team'] },
  { email: 'agirodat@gillissales.com',   fullName: 'Aimee Girodat',      title: 'VP of Sales Performance',         role: 'executive', podId: 'executive_team', manages: ['aimee_pod'] },
  { email: 'nsharpley@gillissales.com',  fullName: 'Nikki Sharpley',     title: 'VP of Operations',                role: 'executive', podId: 'executive_team', manages: ['nikki_ops_pod'] },
  { email: 'sstrobusch@gillissales.com', fullName: 'Shannon Strobusch',  title: 'VP of Business Development',      role: 'executive', podId: 'executive_team', manages: null },

  // ===== Leaders (5) =====
  { email: 'kbrinkey@gillissales.com', fullName: 'Kanina Brinkey',  title: 'Executive Director of Sales Performance', role: 'leader', podId: 'aimee_pod',     manages: ['kanina_pod'] },
  { email: 'kgarrett@gillissales.com', fullName: 'Katie Garrett',   title: 'Sr. Executive Director of Sales',         role: 'leader', podId: 'aimee_pod',     manages: ['katie_pod'] },
  { email: 'tmorris@gillissales.com',  fullName: 'Tracy Morris',    title: 'Executive Director of Sales Performance', role: 'leader', podId: 'aimee_pod',     manages: ['tracy_pod'] },
  { email: 'lmatias@gillissales.com',  fullName: 'Lili Matias',     title: 'Executive Director of Sales Performance', role: 'leader', podId: 'aimee_pod',     manages: ['lili_pod'] },
  { email: 'bcarlson@gillissales.com', fullName: 'Bianca Carlson',  title: 'Training Facilitator',                    role: 'leader', podId: 'nikki_ops_pod', manages: ['nikki_ops_pod'] },
  { email: 'ngillespie@gillissales.com', fullName: 'Nicole Gillespie', title: 'People and Culture Specialist',        role: 'leader', podId: 'nikki_ops_pod', manages: ['nikki_ops_pod'] },

  // ===== Sellers — Aimee Pod direct reports (13) =====
  // Paula and Laura are sellers but each has an empty pod under Aimee
  { email: 'pjamieson@gillissales.com',     fullName: 'Paula Jamieson',     title: 'National Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: ['paula_pod'] },
  { email: 'lpayne@gillissales.com',        fullName: 'Laura Payne',        title: 'National Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: ['laura_pod'] },
  { email: 'wdavilahill@gillissales.com',   fullName: 'Wendy Davila Hill',  title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'lely@gillissales.com',          fullName: 'Linda Ely',          title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'dfavel@gillissales.com',        fullName: 'Darin Favel',        title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'jbelval@gillissales.com',       fullName: 'Jules Belval',       title: 'Senior Regional Director of Sales',  role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'pkerfont@gillissales.com',      fullName: 'Paul Kerfont',       title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'gpatterson@gillissales.com',    fullName: 'Geri Patterson',     title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'ksmith@gillissales.com',        fullName: 'Kristi Smith',       title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'aauvil@gillissales.com',        fullName: 'Ashley Auvil',       title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'lmcneill@gillissales.com',      fullName: 'Lachelle McNeill',   title: 'Senior Regional Director of Sales',  role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'lelmo@gillissales.com',         fullName: 'Lynsey Elmo',        title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },
  { email: 'cverdin@gillissales.com',       fullName: 'Connie Verdin',      title: 'Regional Director of Sales',         role: 'seller', podId: 'aimee_pod', manages: null },

  // ===== Sellers — Kanina Pod (7) =====
  { email: 'aeysallenne@gillissales.com',   fullName: 'Ariel Eysallenne',    title: 'Regional Director of Sales',        role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'jpeperfelty@gillissales.com',   fullName: 'Jennifer Peper-Felty', title: 'Regional Director of Sales',       role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'cgonzalez@gillissales.com',     fullName: 'Cindy Gonzalez',      title: 'Regional Director of Sales',        role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'ascott@gillissales.com',        fullName: 'Alexa Scott',         title: 'Regional Director of Sales',        role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'ajansen@gillissales.com',       fullName: 'Amber Jansen',        title: 'Regional Director of Sales',        role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'kthompson@gillissales.com',     fullName: 'Kimberly Thompson',   title: 'Senior Regional Director of Sales', role: 'seller', podId: 'kanina_pod', manages: null },
  { email: 'gzanniflorian@gillissales.com', fullName: 'Gina Zannie-Florian', title: 'Regional Director of Sales',        role: 'seller', podId: 'kanina_pod', manages: null },

  // ===== Sellers — Lili Pod (9) =====
  { email: 'kbennett@gillissales.com',  fullName: 'Kenzle Bennett',    title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'sbroderick@gillissales.com', fullName: 'Suzan Broderick',  title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'rcohen@gillissales.com',    fullName: 'Rebecca Cohen',     title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'ndaly@gillissales.com',     fullName: 'Natalie Daly',      title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'jjones@gillissales.com',    fullName: 'Janae Jones',       title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'hschimizzi@gillissales.com', fullName: 'Haley Schimizzi',  title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'jtirocke@gillissales.com',  fullName: 'Jodi Tirocke',      title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'bwilbourn@gillissales.com', fullName: 'Bekah Wilbourn',    title: 'Regional Director of Sales',        role: 'seller', podId: 'lili_pod', manages: null },
  { email: 'bduchessi@gillissales.com', fullName: 'Bethany Duchessi',  title: 'Senior Regional Director of Sales', role: 'seller', podId: 'lili_pod', manages: null },

  // ===== Sellers — Tracy Pod (9) — includes Brady (no longer leader) =====
  { email: 'barmstrong@gillissales.com', fullName: 'Brady Armstrong',   title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'kking@gillissales.com',     fullName: 'KayLou King',        title: 'Senior Regional Director of Sales', role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'kbradley@gillissales.com',  fullName: 'Kim Bradley',        title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'smcnaughton@gillissales.com', fullName: 'Stacey McNaughton', title: 'Regional Director of Sales',       role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'khall@gillissales.com',     fullName: 'Kay Hall',           title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'jtyre@gillissales.com',     fullName: 'Jessica Tyre',       title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'tjones@gillissales.com',    fullName: 'Taylor Jones',       title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'cwillis@gillissales.com',   fullName: 'Cassie Willis',      title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },
  { email: 'mhibner@gillissales.com',   fullName: 'Monica Hibner',      title: 'Regional Director of Sales',        role: 'seller', podId: 'tracy_pod', manages: null },

  // ===== Sellers / Ops Support — Nikki Ops Pod (4) =====
  // Terri and Laura Tews report to Alissa. Treated as sellers in Nikki Ops Pod.
  { email: 'tmclean@gillissales.com', fullName: 'Terri McLean',  title: 'Dynamic Strategy Analyst',      role: 'seller', podId: 'nikki_ops_pod', manages: null },
  { email: 'ltews@gillissales.com',   fullName: 'Laura Tews',    title: 'Sales Specialist',              role: 'seller', podId: 'nikki_ops_pod', manages: null },

  // ===== Admin (6) =====
  // Admins now have Tammy chat access (per Tammy's call: Alissa needs coaching access)
  { email: 'ryan@gambitco.io',        fullName: 'Ryan',              title: 'Platform Developer (Gambit)',          role: 'admin', podId: null,            manages: null },
  { email: 'talmond@gillissales.com', fullName: 'Tysha Almond',      title: 'Business Analyst, Operations',         role: 'admin', podId: 'aimee_pod',     manages: null },
  { email: 'kemmons@gillissales.com', fullName: 'Kevin Emmons',      title: 'Salesforce Administrator',             role: 'admin', podId: 'aimee_pod',     manages: null },
  { email: 'achristy@gillissales.com', fullName: 'Alissa Christy',   title: 'Manager, New Client Implementation',   role: 'admin', podId: 'nikki_ops_pod', manages: null },
  { email: 'twilkinson@gillissales.com', fullName: 'Taylor Wilkinson', title: 'Talent Coordinator',                 role: 'admin', podId: 'nikki_ops_pod', manages: null },
  { email: 'abernal@gillissales.com', fullName: 'Alexandra Bernal',  title: 'Senior Finance Administrator',         role: 'admin', podId: 'nikki_ops_pod', manages: null },
  { email: 'jenllokbo@gillissales.com', fullName: 'Josephine Enilolobo', title: 'Accounting and Administrative',     role: 'admin', podId: 'nikki_ops_pod', manages: null },
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
