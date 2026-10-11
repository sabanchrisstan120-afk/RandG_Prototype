import type { Customer, Technician, ServiceJob, User } from '../types';

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'TECH-01',
    name: 'Mark Santos',
    contactNumber: '0917-555-8120',
    specialty: 'Inverter Diagnostics & Circuit Board Repair',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    email: 'mark.santos@rgaircon.ph',
    joinedDate: '2023-03-15'
  },
  {
    id: 'TECH-02',
    name: 'Carlo Reyes',
    contactNumber: '0918-444-9311',
    specialty: 'Deep Hydro-Wash & Preventive Maintenance',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'carlo.reyes@rgaircon.ph',
    joinedDate: '2023-08-01'
  },
  {
    id: 'TECH-03',
    name: 'Michael Fernandez',
    contactNumber: '0922-333-7204',
    specialty: 'Split-Type Installation & Piping Fabrication',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'michael.f@rgaircon.ph',
    joinedDate: '2022-11-10'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Juan Dela Cruz',
    contactNumber: '0917-812-4902',
    address: 'Unit 1402, Renaissance Tower 2000, Meralco Ave, Pasig City',
    email: 'juan.delacruz@gmail.com',
    notes: 'Regular client since 2024. Prefers afternoon service visits.',
    createdAt: '2024-02-10T09:00:00Z'
  },
  {
    id: 'CUST-002',
    name: 'Maria Clara Santos',
    contactNumber: '0918-223-4567',
    address: '45 Acacia St., Valle Verde 3, Pasig City',
    email: 'maria.santos@yahoo.com',
    notes: 'Guard house requires gate pass before entry. Call 15 mins ahead.',
    createdAt: '2025-01-14T10:30:00Z'
  },
  {
    id: 'CUST-003',
    name: 'David Lim',
    contactNumber: '0920-987-6543',
    address: 'Penthouse B, One Serendra, Bonifacio Global City, Taguig',
    email: 'david.lim@outlook.com',
    notes: 'Condo building management requires work permit & technician IDs.',
    createdAt: '2025-06-20T14:15:00Z'
  },
  {
    id: 'CUST-004',
    name: 'Roberto Alonzo',
    contactNumber: '0917-345-6789',
    address: '128 Maginhawa St., Teachers Village East, Quezon City',
    email: 'r.alonzo@gmail.com',
    notes: 'Residential duplex, street parking available in front.',
    createdAt: '2025-08-05T11:00:00Z'
  },
  {
    id: 'CUST-005',
    name: 'Elena Bautista',
    contactNumber: '0922-555-1234',
    address: '22 Orchid Rd., Ayala Alabang Village, Muntinlupa City',
    email: 'elena.bautista@gmail.com',
    notes: 'Two-story residential home. Multiple units installed in 2023.',
    createdAt: '2025-09-12T08:45:00Z'
  },
  {
    id: 'CUST-006',
    name: 'Architect Kenneth Tan',
    contactNumber: '0917-678-9012',
    address: 'Unit 804, The Lerato Tower 1, Malugay St, Bel-Air, Makati',
    email: 'ktan.design@gmail.com',
    notes: 'Architectural studio and residence. Heavy aircon usage.',
    createdAt: '2025-11-03T16:20:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADMIN',
    name: 'Engr. Roberto Gomez',
    role: 'admin',
    email: 'admin@rgaircon.ph',
    title: 'Operations & Service Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-TECH-01',
    name: 'Mark Santos',
    role: 'technician',
    technicianId: 'TECH-01',
    email: 'mark.santos@rgaircon.ph',
    title: 'Senior Field Technician',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-TECH-02',
    name: 'Carlo Reyes',
    role: 'technician',
    technicianId: 'TECH-02',
    email: 'carlo.reyes@rgaircon.ph',
    title: 'Cleaning & Maintenance Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-TECH-03',
    name: 'Michael Fernandez',
    role: 'technician',
    technicianId: 'TECH-03',
    email: 'michael.f@rgaircon.ph',
    title: 'Installation & Repair Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const SAMPLE_SERVICE_PHOTOS = {
  dirtyCoil: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
  cleanedCoil: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  gaugeCheck: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
  capacitorTesting: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80',
  indoorCleanUnit: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
  outdoorCondenser: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80'
};

export const INITIAL_SERVICE_JOBS: ServiceJob[] = [
  // 1. Juan Dela Cruz - Completed Repair (Assigned to & Completed by Mark Santos)
  {
    id: 'SRV-2026-0001',
    customerId: 'CUST-001',
    customerName: 'Juan Dela Cruz',
    customerContact: '0917-812-4902',
    customerAddress: 'Unit 1402, Renaissance Tower 2000, Meralco Ave, Pasig City',
    aircon: {
      brand: 'Carrier',
      type: 'Split-Type',
      capacityHp: '1.5 HP',
      details: 'Living Area unit, Inverter X-Power Gold, Model FP-53CVS012'
    },
    complaint: 'Aircon is not blowing cold air. Fan runs continuously but compressor trips after 3 minutes with clicking sound.',
    serviceType: 'Repair',
    preferredDate: '2026-10-02',
    adminRemarks: 'Customer reported issue started after severe thunderstorm. Bring 35uF dual run capacitor and digital clamp meter.',
    assignedTechnicianId: 'TECH-01',
    assignedTechnicianName: 'Mark Santos',
    originalTechnicianId: 'TECH-01',
    originalTechnicianName: 'Mark Santos',
    assignedAt: '2026-10-02T08:30:00Z',
    startedAt: '2026-10-02T10:15:00Z',
    completedAt: '2026-10-02T12:45:00Z',
    status: 'Completed',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-02T08:30:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Job created and assigned to Mark Santos' },
      { status: 'In Progress', timestamp: '2026-10-02T10:15:00Z', updatedBy: 'Mark Santos', remarks: 'Arrived on site and began electrical diagnostic' },
      { status: 'Completed', timestamp: '2026-10-02T12:45:00Z', updatedBy: 'Mark Santos', remarks: 'Replaced defective capacitor and tested cooling' }
    ],
    completionReport: {
      workPerformed: 'Tested compressor starting circuit. Found swollen 35uF/450V starting capacitor reading only 6.2uF. Replaced with genuine heavy-duty 35uF run capacitor. Cleaned contactor points, checked refrigerant suction pressure (125 PSI R410A), and verified cooling temperature drop at 11.5°C.',
      findingsAndRecommendations: 'Compressor windings measured normal resistance (1.8 / 2.4 ohms). Recommend full hydro-chemical cleaning within the next 3 months as indoor coil is starting to accumulate dust.',
      photos: [
        {
          id: 'p-01',
          url: SAMPLE_SERVICE_PHOTOS.capacitorTesting,
          type: 'before',
          caption: 'Defective swollen 35uF capacitor reading faulty microfarads',
          uploadedAt: '2026-10-02T10:45:00Z'
        },
        {
          id: 'p-02',
          url: SAMPLE_SERVICE_PHOTOS.gaugeCheck,
          type: 'after',
          caption: 'New capacitor installed, verified stable 125 PSI suction pressure',
          uploadedAt: '2026-10-02T12:30:00Z'
        }
      ],
      completedByTechId: 'TECH-01',
      completedByTechName: 'Mark Santos',
      completedAt: '2026-10-02T12:45:00Z',
      confirmationChecked: true
    }
  },

  // 2. Juan Dela Cruz - Completed Cleaning (Assigned to & Completed by Carlo Reyes)
  {
    id: 'SRV-2026-0008',
    customerId: 'CUST-001',
    customerName: 'Juan Dela Cruz',
    customerContact: '0917-812-4902',
    customerAddress: 'Unit 1402, Renaissance Tower 2000, Meralco Ave, Pasig City',
    aircon: {
      brand: 'Panasonic',
      type: 'Split-Type',
      capacityHp: '1.0 HP',
      details: 'Master Bedroom unit, Aero Series Inverter'
    },
    complaint: 'Foul musty smell whenever unit starts up. Water occasionally drips from left side of indoor blower casing.',
    serviceType: 'Cleaning',
    preferredDate: '2026-10-06',
    adminRemarks: 'Deep cleaning required. Bring high-pressure hydro washer, drip catch bag, and anti-bacterial coil sanitizer.',
    assignedTechnicianId: 'TECH-02',
    assignedTechnicianName: 'Carlo Reyes',
    originalTechnicianId: 'TECH-02',
    originalTechnicianName: 'Carlo Reyes',
    assignedAt: '2026-10-06T09:00:00Z',
    startedAt: '2026-10-06T13:30:00Z',
    completedAt: '2026-10-06T15:15:00Z',
    status: 'Completed',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-06T09:00:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Scheduled afternoon preventive cleaning' },
      { status: 'In Progress', timestamp: '2026-10-06T13:30:00Z', updatedBy: 'Carlo Reyes', remarks: 'Setup protective sheeting and disassembled casing' },
      { status: 'Completed', timestamp: '2026-10-06T15:15:00Z', updatedBy: 'Carlo Reyes', remarks: 'Deep hydro-cleaning finished, drainage flushed' }
    ],
    completionReport: {
      workPerformed: 'Full deep hydro-chemical wash performed on indoor evaporator coil and blower wheel. Cleared jelly sludge blockage inside 5/8" condensate drain line using nitrogen blast. Sprayed anti-fungal deodorizing treatment on aluminum fins. Cleaned filters and outdoor condenser coil.',
      findingsAndRecommendations: 'Drain line cleared and slope adjusted slightly to prevent future backflow. Unit cooling efficiently with odorless airflow. Next cleaning recommended after 5 months.',
      photos: [
        {
          id: 'p-03',
          url: SAMPLE_SERVICE_PHOTOS.dirtyCoil,
          type: 'before',
          caption: 'Evaporator coil clogged with thick dust and mildew prior to wash',
          uploadedAt: '2026-10-06T13:45:00Z'
        },
        {
          id: 'p-04',
          url: SAMPLE_SERVICE_PHOTOS.cleanedCoil,
          type: 'after',
          caption: 'Thoroughly sanitized aluminum fins and degreased blower wheel',
          uploadedAt: '2026-10-06T15:00:00Z'
        }
      ],
      completedByTechId: 'TECH-02',
      completedByTechName: 'Carlo Reyes',
      completedAt: '2026-10-06T15:15:00Z',
      confirmationChecked: true
    }
  },

  // 3. Juan Dela Cruz - In Progress Installation (Assigned to Mark Santos)
  {
    id: 'SRV-2026-0015',
    customerId: 'CUST-001',
    customerName: 'Juan Dela Cruz',
    customerContact: '0917-812-4902',
    customerAddress: 'Unit 1402, Renaissance Tower 2000, Meralco Ave, Pasig City',
    aircon: {
      brand: 'Daikin',
      type: 'Inverter',
      capacityHp: '2.0 HP',
      details: 'New Home Office room, Daikin D-Smart King Inverter'
    },
    complaint: 'Installation of brand new unit provided by client. Need mounting on concrete wall and piping to outdoor ledge.',
    serviceType: 'Installation',
    preferredDate: '2026-10-11',
    adminRemarks: 'Condo building permits secured at security office. Please verify copper tube vacuum pressure down to 500 microns before opening service valves.',
    assignedTechnicianId: 'TECH-01',
    assignedTechnicianName: 'Mark Santos',
    originalTechnicianId: 'TECH-01',
    originalTechnicianName: 'Mark Santos',
    assignedAt: '2026-10-10T16:00:00Z',
    startedAt: '2026-10-11T09:30:00Z',
    status: 'In Progress',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-10T16:00:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'New installation assignment logged' },
      { status: 'In Progress', timestamp: '2026-10-11T09:30:00Z', updatedBy: 'Mark Santos', remarks: 'Began drilling bracket holes and laying insulated copper pipes' }
    ]
  },

  // 4. Maria Clara Santos - Assigned (Carlo Reyes)
  {
    id: 'SRV-2026-0021',
    customerId: 'CUST-002',
    customerName: 'Maria Clara Santos',
    customerContact: '0918-223-4567',
    customerAddress: '45 Acacia St., Valle Verde 3, Pasig City',
    aircon: {
      brand: 'Carrier',
      type: 'Split-Type',
      capacityHp: '1.5 HP',
      details: 'Dining Room unit, Crystal Inverter'
    },
    complaint: 'Indoor unit leaks water down the wall onto wooden buffet cabinet. Air feels humid and weak.',
    serviceType: 'Repair',
    preferredDate: '2026-10-11',
    adminRemarks: 'Client is worried about wooden furniture. Check for cracked drain pan or disconnected elbow joint.',
    assignedTechnicianId: 'TECH-02',
    assignedTechnicianName: 'Carlo Reyes',
    originalTechnicianId: 'TECH-02',
    originalTechnicianName: 'Carlo Reyes',
    assignedAt: '2026-10-11T08:15:00Z',
    status: 'Assigned',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-11T08:15:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Urgent leak repair assigned to Carlo Reyes' }
    ]
  },

  // 5. David Lim - In Progress (Mark Santos)
  {
    id: 'SRV-2026-0022',
    customerId: 'CUST-003',
    customerName: 'David Lim',
    customerContact: '0920-987-6543',
    customerAddress: 'Penthouse B, One Serendra, Bonifacio Global City, Taguig',
    aircon: {
      brand: 'Daikin',
      type: 'Inverter',
      capacityHp: '2.5 HP',
      details: 'Master Suite ceiling-concealed split unit'
    },
    complaint: 'System shuts down after 15 minutes of operation with blinking green light. Error code U4 displayed on wired thermostat.',
    serviceType: 'Repair',
    preferredDate: '2026-10-11',
    adminRemarks: 'U4 error indicates indoor-to-outdoor transmission failure. Inspect terminal block connections and PCB fuse.',
    assignedTechnicianId: 'TECH-01',
    assignedTechnicianName: 'Mark Santos',
    originalTechnicianId: 'TECH-01',
    originalTechnicianName: 'Mark Santos',
    assignedAt: '2026-10-10T14:00:00Z',
    startedAt: '2026-10-11T13:00:00Z',
    status: 'In Progress',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-10T14:00:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Assigned for Inverter diagnosis' },
      { status: 'In Progress', timestamp: '2026-10-11T13:00:00Z', updatedBy: 'Mark Santos', remarks: 'Technician logged on-site; opening condenser control box' }
    ]
  },

  // 6. Roberto Alonzo - Reassigned job! (Demonstrates essential reassignment history!)
  {
    id: 'SRV-2026-0023',
    customerId: 'CUST-004',
    customerName: 'Roberto Alonzo',
    customerContact: '0917-345-6789',
    customerAddress: '128 Maginhawa St., Teachers Village East, Quezon City',
    aircon: {
      brand: 'Condura',
      type: 'Window',
      capacityHp: '1.0 HP',
      details: 'Study Room, Condura 6X Inverter Window Type'
    },
    complaint: 'Loud metallic buzzing noise whenever compressor kicks in. Vibration shakes the window frame.',
    serviceType: 'Repair',
    preferredDate: '2026-10-12',
    adminRemarks: 'Check compressor mounting rubber grommets and fan motor shaft alignment.',
    assignedTechnicianId: 'TECH-01',
    assignedTechnicianName: 'Mark Santos',
    originalTechnicianId: 'TECH-02',
    originalTechnicianName: 'Carlo Reyes',
    assignedAt: '2026-10-10T11:00:00Z',
    status: 'Assigned',
    reassignments: [
      {
        id: 'reassign-001',
        fromTechnicianId: 'TECH-02',
        fromTechnicianName: 'Carlo Reyes',
        toTechnicianId: 'TECH-01',
        toTechnicianName: 'Mark Santos',
        reassignedAt: '2026-10-11T10:30:00Z',
        reason: 'Client requested technician with specific expertise in inverted compressor mounting dampening; Carlo was scheduled for extended Pasig cleaning.',
        reassignedBy: 'Engr. Roberto Gomez'
      }
    ],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-10T11:00:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Initially assigned to Carlo Reyes' },
      { status: 'Assigned', timestamp: '2026-10-11T10:30:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Reassigned from Carlo Reyes to Mark Santos' }
    ]
  },

  // 7. Elena Bautista - Completed Maintenance (Michael Fernandez)
  {
    id: 'SRV-2026-0024',
    customerId: 'CUST-005',
    customerName: 'Elena Bautista',
    customerContact: '0922-555-1234',
    customerAddress: '22 Orchid Rd., Ayala Alabang Village, Muntinlupa City',
    aircon: {
      brand: 'Panasonic',
      type: 'Split-Type',
      capacityHp: '2.0 HP',
      details: 'Family Den, Panasonic Sky Series Inverter'
    },
    complaint: 'Semi-annual general inspection and comprehensive maintenance service.',
    serviceType: 'Maintenance',
    preferredDate: '2026-10-09',
    adminRemarks: 'Regular VIP client contract. Full electrical amp draw check and coil washing.',
    assignedTechnicianId: 'TECH-03',
    assignedTechnicianName: 'Michael Fernandez',
    originalTechnicianId: 'TECH-03',
    originalTechnicianName: 'Michael Fernandez',
    assignedAt: '2026-10-08T15:00:00Z',
    startedAt: '2026-10-09T09:00:00Z',
    completedAt: '2026-10-09T11:30:00Z',
    status: 'Completed',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-08T15:00:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Scheduled VIP maintenance' },
      { status: 'In Progress', timestamp: '2026-10-09T09:00:00Z', updatedBy: 'Michael Fernandez', remarks: 'Arrived on site and started maintenance routine' },
      { status: 'Completed', timestamp: '2026-10-09T11:30:00Z', updatedBy: 'Michael Fernandez', remarks: 'Maintenance checklist finished and signed off' }
    ],
    completionReport: {
      workPerformed: 'Conducted 12-point inspection: Amp draw nominal at 6.1A, refrigerant operating pressure at 130 PSI. Hydro-cleaned both evaporator and outdoor condenser coil with neutral foam wash. Greased indoor blower bearings and tightened electrical terminal screws.',
      findingsAndRecommendations: 'Unit is in excellent operating condition. Temperature output verified at 12.0°C. Next scheduled maintenance in April 2027.',
      photos: [
        {
          id: 'p-05',
          url: SAMPLE_SERVICE_PHOTOS.outdoorCondenser,
          type: 'before',
          caption: 'Outdoor condenser fins dusty before pressurized hydro-cleaning',
          uploadedAt: '2026-10-09T09:20:00Z'
        },
        {
          id: 'p-06',
          url: SAMPLE_SERVICE_PHOTOS.indoorCleanUnit,
          type: 'after',
          caption: 'Clean indoor unit operational and delivering crisp chilled air',
          uploadedAt: '2026-10-09T11:15:00Z'
        }
      ],
      completedByTechId: 'TECH-03',
      completedByTechName: 'Michael Fernandez',
      completedAt: '2026-10-09T11:30:00Z',
      confirmationChecked: true
    }
  },

  // 8. Architect Kenneth Tan - On Hold (Michael Fernandez)
  {
    id: 'SRV-2026-0025',
    customerId: 'CUST-006',
    customerName: 'Architect Kenneth Tan',
    customerContact: '0917-678-9012',
    customerAddress: 'Unit 804, The Lerato Tower 1, Malugay St, Bel-Air, Makati',
    aircon: {
      brand: 'Mitsubishi Heavy',
      type: 'Floor Mounted',
      capacityHp: '3.0 HP',
      details: 'Studio Office, Commercial Inverter Floor Unit'
    },
    complaint: 'Heavy vibration and screeching metal noise coming from internal centrifugal blower fan.',
    serviceType: 'Repair',
    preferredDate: '2026-10-10',
    adminRemarks: 'Studio needs quiet environment for client meetings. Check blower motor bearings.',
    assignedTechnicianId: 'TECH-03',
    assignedTechnicianName: 'Michael Fernandez',
    originalTechnicianId: 'TECH-03',
    originalTechnicianName: 'Michael Fernandez',
    assignedAt: '2026-10-10T08:00:00Z',
    startedAt: '2026-10-10T14:00:00Z',
    status: 'On Hold',
    onHoldReason: 'Awaiting specialized sealed blower motor bearing (6201ZZ) from central parts supplier. Expected delivery tomorrow morning.',
    reassignments: [],
    statusHistory: [
      { status: 'Assigned', timestamp: '2026-10-10T08:00:00Z', updatedBy: 'Engr. Roberto Gomez', remarks: 'Assigned to Michael Fernandez' },
      { status: 'In Progress', timestamp: '2026-10-10T14:00:00Z', updatedBy: 'Michael Fernandez', remarks: 'Disassembled blower assembly' },
      { status: 'On Hold', timestamp: '2026-10-10T15:45:00Z', updatedBy: 'Michael Fernandez', remarks: 'Blower motor bearing worn out. Paused pending part delivery.' }
    ]
  }
];

export const QUICK_WORK_PERFORMED_TEMPLATES = [
  'Deep hydro-chemical wash of indoor evaporator coil, blower wheel, and condenser unit. Cleared drain line with nitrogen blast.',
  'Replaced defective dual run capacitor. Cleaned contactor terminals and verified stable operating suction pressure.',
  'Isolated refrigerant leak on flare joint nut, fabricated new copper flare fitting, vacuumed system to 500 microns, and recharged R410A refrigerant.',
  'Replaced worn indoor fan blower motor bearings, lubricated shaft assembly, and aligned fan cage.',
  'Full mounting installation completed. Pressure leak tested copper piping at 400 PSI, vacuumed lines, and wired dedicated circuit breaker.'
];

export const QUICK_FINDINGS_TEMPLATES = [
  'Unit cooling performance restored to manufacturer spec (11.5°C supply air). Recommended routine cleaning in 4 months.',
  'Refrigerant operating pressure stable at 125 PSI with 8.5A compressor draw. Cleaned washable filter screens.',
  'Outdoor condenser location has adequate cross-ventilation. Advised customer to keep surrounding area free from debris.',
  'Electrical supply line voltage measured stable at 228V. All terminal screws re-torqued.'
];
