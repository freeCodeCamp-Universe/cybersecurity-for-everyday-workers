export const COURSE_TITLE = "Cybersecurity for Everyday Workers";

export const MODULES = [
  {
    id: 1,
    title: "Passwords, Passkeys & Authentication",
    summary: "Replace outdated password habits with current, evidence-based practices.",
    units: [
      { id: 1, title: "Why Your Password Probably Already Failed You", objective: "Identify which password habits create known attack vectors and explain why each fails." },
      { id: 2, title: "What Actually Makes a Password Strong", objective: "Construct a password meeting current NIST 2024 strength criteria and explain the role of length and unpredictability." },
      { id: 3, title: "Password Managers: One Strong Password to Rule Them All", objective: "Set up a password manager account, store two work credentials, and retrieve one credential without typing it manually." },
      { id: 4, title: "Multi-Factor Authentication: A Second Lock on the Door", objective: "Rank three MFA methods by security strength and select the appropriate method for a described workplace scenario." },
      { id: 5, title: "Passkeys: Logging In Without a Password", objective: "Explain what a passkey is, how it differs from a password, and set up a passkey on one supported account." },
      { id: 6, title: "Putting It Together: Your Authentication Stack at Work", objective: "Complete an audit of five most-used work accounts and produce a written three-step action plan with specific dates." },
    ],
  },
  {
    id: 2,
    title: "Phishing & Social Engineering",
    summary: "Recognize the psychological levers behind phishing across email, text, voice, and QR.",
    units: [
      { id: 1, title: "How Phishing Actually Works", objective: "Identify the three psychological levers attackers most often use and explain why technical defenses alone do not stop phishing." },
      { id: 2, title: "Reading an Email Like an Attacker Wrote It", objective: "Inspect an email and identify at least three signals that suggest a phishing attempt." },
      { id: 3, title: "Beyond Email: Text, Voice, QR, and MFA Prompts", objective: "Recognize phishing attempts delivered through SMS, phone calls, QR codes, and authentication prompts." },
      { id: 4, title: "Targeted Attacks: When the Attacker Knows Your Name", objective: "Distinguish bulk phishing from targeted attacks (spear phishing, BEC, deepfake-assisted) and explain why targeted attacks are harder to catch." },
      { id: 5, title: "What To Do When You See One (And When You Fell For One)", objective: "Execute the correct response when a suspicious message arrives, and the correct response when you have already clicked or shared information." },
      { id: 6, title: "Building the Verification Habit", objective: "Define a personal verification rule and apply it to one realistic scenario from your own work." },
    ],
  },
  {
    id: 3,
    title: "Device Security",
    summary: "Treat the device as the choke point: updates, locks, encryption, and clean software.",
    units: [
      { id: 1, title: "Why The Device Is The Choke Point", objective: "Explain why device compromise undermines every other security control, using two concrete examples." },
      { id: 2, title: "Updates: The Most Boring, Most Important Habit", objective: "Configure automatic updates on the operating system and primary applications, and explain why update delays create risk." },
      { id: 3, title: "Locks, Encryption, and Biometrics", objective: "Confirm or enable a screen lock, full-disk encryption, and a biometric or PIN unlock on each work device." },
      { id: 4, title: "Software Hygiene: What You Install Matters", objective: "Apply three rules for evaluating whether to install a piece of software or grant an app a permission." },
      { id: 5, title: "Public, Shared, and Borrowed Devices", objective: "Identify three actions to avoid on a device that is not your own, and the safe alternatives." },
      { id: 6, title: "When a Device Is Lost or Stolen", objective: "Produce a written response plan for a lost or stolen work device, naming the first three actions and who to contact." },
    ],
  },
  {
    id: 4,
    title: "Safe File Handling",
    summary: "Where files live, how they get shared, and what makes a download dangerous.",
    units: [
      { id: 1, title: "Where Your Files Actually Live", objective: "Identify, for three of your own work files, where each file is stored and who can reach it." },
      { id: 2, title: "Sharing: Links, Attachments, and What Gets Forwarded", objective: "Choose between a shared link and an attachment for a given scenario, and explain the trade-offs." },
      { id: 3, title: "Permissions: Who Can View, Edit, and Share Onward", objective: "Configure permissions on a file or folder to grant the minimum access the recipient needs." },
      { id: 4, title: "Sensitive Data: Knowing What You Are Holding", objective: "Identify three categories of sensitive data that may appear in your daily files and apply the appropriate handling rule for each." },
      { id: 5, title: "Receiving Files: Attachments, Downloads, and Macros", objective: "Apply a three-step check before opening an unexpected attachment or downloaded file." },
      { id: 6, title: "Backups and Versions: When Files Go Wrong", objective: "Confirm that your work files have at least one independent backup and locate the version history of one shared document." },
    ],
  },
  {
    id: 5,
    title: "Network Hygiene",
    summary: "What someone on the same network can see, and what your router and VPN actually do.",
    units: [
      { id: 1, title: "What Someone On The Same Network Can Actually See", objective: "Describe what is encrypted and what is visible to an attacker on the same Wi-Fi network in 2026." },
      { id: 2, title: "Wi-Fi: Home, Work, and Public", objective: "Apply different baseline behaviors to home, work, and public Wi-Fi based on the trust model of each." },
      { id: 3, title: "VPNs: What They Do, What They Do Not", objective: "Decide whether a VPN is useful in three workplace scenarios and explain what it does and does not protect against." },
      { id: 4, title: "Browser Warnings, Certificates, and the Padlock", objective: "Interpret three types of browser security warning correctly and respond appropriately to each." },
      { id: 5, title: "Your Home Network and the Devices On It", objective: "Apply five baseline settings to a home router and explain why each matters." },
      { id: 6, title: "Travel and Conference Networks", objective: "Construct a personal travel-network rule covering three scenarios: hotel Wi-Fi, airport Wi-Fi, and conference Wi-Fi." },
    ],
  },
  {
    id: 6,
    title: "Access Control & Permissions",
    summary: "Least privilege: granting, using, and giving back only the access you need.",
    units: [
      { id: 1, title: "Least Privilege: The Idea Behind All Access Decisions", objective: "Apply the principle of least privilege to three real workplace access decisions." },
      { id: 2, title: "Roles, Groups, and Why Individual Permissions Get Messy", objective: "Distinguish role-based access from individual one-off permissions and explain why the role-based model scales better." },
      { id: 3, title: "Shared Accounts: Why They Look Easy and Cost a Lot", objective: "Identify three problems caused by shared accounts and recommend an alternative." },
      { id: 4, title: "The Access Lifecycle: Grant, Use, Revoke", objective: "Describe the three stages of access lifecycle and identify where access most commonly leaks." },
      { id: 5, title: "Reviewing Your Own Access", objective: "Audit your own current access at work and identify three accesses to remove or downgrade." },
      { id: 6, title: "When You Need More: Asking Well", objective: "Write a clean access request that includes role, scope, duration, and justification." },
    ],
  },
  {
    id: 7,
    title: "Data Classification",
    summary: "Spot regulated and sensitive data and apply the right handling rules.",
    units: [
      { id: 1, title: "Why Classification Exists", objective: "Explain in two sentences why treating all data the same is a security failure, with a concrete example." },
      { id: 2, title: "A Working Four-Level Model", objective: "Define four classification levels (public, internal, confidential, restricted) and place ten data examples into the correct level." },
      { id: 3, title: "Regulated Categories: PII, PHI, PCI, and IP", objective: "Recognize four regulated data categories in workplace examples and name the regulation that most often applies." },
      { id: 4, title: "Spotting Sensitive Data In Your Daily Work", objective: "Scan a sample of files and messages from your own work and identify three previously unrecognized sensitive items." },
      { id: 5, title: "Handling Rules By Level", objective: "Match correct handling rules (storage, sharing, retention) to each classification level." },
      { id: 6, title: "When You Are Not Sure", objective: "Apply a default rule for ambiguous data and identify when to ask before acting." },
    ],
  },
  {
    id: 8,
    title: "Incident Reporting",
    summary: "Recognize, report, and preserve. The first hour matters most.",
    units: [
      { id: 1, title: "Why The First Hour Matters", objective: "Explain why fast reporting reduces incident impact, with two concrete examples." },
      { id: 2, title: "What Counts: Recognizing Incidents", objective: "Recognize five categories of reportable security event in workplace examples." },
      { id: 3, title: "Who To Tell And How", objective: "Identify the correct reporting path for three incident types in your own organization." },
      { id: 4, title: "Preserve, Do Not Tidy", objective: "Apply three preservation rules during a suspected incident and explain why each matters." },
      { id: 5, title: "What Happens After You Report", objective: "Describe the typical post-report sequence and the reporter's role within it." },
      { id: 6, title: "The No-Blame Frame", objective: "State the personal commitment to report honest mistakes and identify two things your organization can do to support a no-blame reporting culture." },
    ],
  },
  {
    id: 9,
    title: "Common Attack Patterns",
    summary: "Ransomware, BEC, credential theft, supply chain, and insider threats explained simply.",
    units: [
      { id: 1, title: "The Attacker's Playbook", objective: "Name the four stages of a typical attack and identify which stage three earlier-module practices counter." },
      { id: 2, title: "Ransomware: How It Spreads And What To Do", objective: "Describe how ransomware reaches and spreads through an organization and identify three preventive practices and one response action." },
      { id: 3, title: "Business Email Compromise And Invoice Fraud", objective: "Recognize three structural signs of BEC in workplace messages and identify the verification step that defeats the attack." },
      { id: 4, title: "Credential Theft And Account Takeover", objective: "Trace how a single stolen password becomes account takeover and identify the practices that break the chain at each step." },
      { id: 5, title: "Supply Chain Attacks: When The Trusted Source Is Compromised", objective: "Define a supply chain attack and identify two ways a worker might encounter one." },
      { id: 6, title: "Insider Threats: Intentional And Accidental", objective: "Distinguish intentional insider threats from accidental ones and explain why most insider incidents are accidental." },
    ],
  },
  {
    id: 10,
    title: "Remote Work Security",
    summary: "Working safely from home, cafes, trains, and the road.",
    units: [
      { id: 1, title: "The Remote Attack Surface", objective: "Identify three risks specific to remote work that office work does not have, with a concrete example for each." },
      { id: 2, title: "Setting Up A Secure Home For Work", objective: "Apply five home-setup practices and confirm each on your own setup." },
      { id: 3, title: "Video Calls And Screen Sharing", objective: "Apply pre-call, during-call, and screen-sharing practices to avoid common information leaks." },
      { id: 4, title: "Working From Cafes, Trains, And Other Public Spaces", objective: "Apply four public-space practices and decide what work is and is not appropriate for those spaces." },
      { id: 5, title: "The Personal-Versus-Work Device Boundary", objective: "Identify three practices that maintain the boundary between personal and work devices and explain the security and personal benefits of each." },
      { id: 6, title: "Travel With A Work Device", objective: "Produce a travel preparation and in-travel practice plan covering pre-departure, in-transit, and at-destination phases." },
    ],
  },
];

export function getModule(moduleId) {
  return MODULES.find((m) => m.id === moduleId) || null;
}

export function getUnit(moduleId, unitId) {
  const m = getModule(moduleId);
  return m ? m.units.find((u) => u.id === unitId) || null : null;
}

export function contentPath(moduleId, unitId) {
  return new URL(`../../content/modules/m${moduleId}/u${unitId}.html`, import.meta.url).toString();
}

const FLAT_UNITS = MODULES.flatMap((module) =>
  module.units.map((unit) => ({ moduleId: module.id, unitId: unit.id }))
);

export function lessonHref(moduleId, unitId) {
  return `./lesson/?m=${moduleId}&u=${unitId}`;
}

export function getAdjacentUnit(moduleId, unitId, offset) {
  const index = FLAT_UNITS.findIndex(
    (entry) => entry.moduleId === moduleId && entry.unitId === unitId
  );
  if (index === -1) return null;
  return FLAT_UNITS[index + offset] || null;
}
