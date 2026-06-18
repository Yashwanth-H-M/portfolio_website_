# Peerya

> Nobody learns alone anymore.

Peerya is building the future of collaborative self-learning.

We believe the internet solved access to knowledge but failed to solve one fundamental problem:

**Learning is still lonely.**

Every day, millions of ambitious students, developers, creators, and professionals try to learn new skills alone. They start courses, watch tutorials, and set goals—but most eventually lose momentum because they lack accountability, community, and a team that grows with them.

Peerya changes that.

---

## The Problem

Traditional education provides structure and peers.

Self-learning does not.

Most people learning outside formal education face the same challenges:

* No accountability
* No consistent learning partners
* No sense of belonging
* No long-term support system
* High dropout rates
* Difficulty finding people with similar goals

The result is isolation, inconsistency, and unrealized potential.

---

## Our Vision

Imagine joining a small team of ambitious people from around the world who:

* Share your learning goals
* Match your experience level
* Meet regularly
* Support each other daily
* Grow together over months and years

Peerya exists to create those teams.

We believe every ambitious person deserves a tribe.

---

## How Peerya Works

### 1. Join

Users apply by sharing:

* Skill interest
* Experience level
* Location
* Learning goals
* Commitment preferences

### 2. Match

Peerya forms carefully curated teams of 5–10 people based on:

* Shared interests
* Skill level compatibility
* Commitment alignment
* Learning objectives

### 3. Commit

Each team makes a collective commitment to grow together through:

* Weekly meetings
* Daily accountability
* Shared milestones
* Long-term support

### 4. Grow

Members:

* Learn faster
* Stay accountable
* Build meaningful relationships
* Achieve goals together

---

## The Role of AI

Peerya uses AI as a facilitator, not a replacement for human connection.

Our AI systems help:

* Guide meetings
* Track commitments
* Monitor progress
* Generate accountability prompts
* Surface team insights
* Encourage consistent participation

The goal is simple:

**More human connection, not less.**

---

## Current MVP

The current Peerya MVP includes:

* Landing page
* Waitlist onboarding
* User application form
* Team formation workflow
* Founder notifications
* Applicant confirmation emails
* Community validation system

Future releases will include:

* Team dashboards
* AI meeting facilitator
* Progress tracking
* Team leaderboards
* Learning analytics
* Community matching engine

---

## Why Peerya Is Different

Most platforms help people consume information.

Peerya helps people stay committed.

Most communities create audiences.

Peerya creates teams.

Most learning platforms focus on content.

Peerya focuses on belonging.

---

## Long-Term Mission

Our mission is to become the place where ambitious people find:

* Learning partners
* Accountability partners
* Collaborators
* Co-founders
* Mentors
* Lifelong teammates

We are not building another course platform.

We are building the social infrastructure for ambitious people.

---

## Founder Story

The idea emerged from a simple realization:

Despite having unlimited access to knowledge online, many ambitious learners still feel alone.

Peerya is an attempt to solve that problem at a global scale.

---

## Status

Early Stage Startup

Currently validating demand and forming the first generation of learning teams.

---

## Technical Setup & Architecture

### 1. Database (Supabase)
Waitlist applications are stored in a `waitlist` table in Supabase. You can create the table using the following SQL in your Supabase SQL Editor:
```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null unique,
  country text not null,
  skill_interest text not null,
  skill_level text not null,
  commitment_period text not null,
  project_idea text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table waitlist enable row level security;
create policy "Allow public inserts" on waitlist for insert with check (true);
create policy "Allow read for service role" on waitlist for select using (true);
```

### 2. Local Backup Fallback
If the database connection is offline, registrations automatically fall back to appending to `data/waitlist.json` to prevent data loss. This file is excluded from Git tracking in `.gitignore` to protect user data.

### 3. Backend Email Automation (EmailJS REST API)
Instead of executing EmailJS calls in the client browser (which exposes secret keys), email dispatches are routed through a secure Next.js API route (`/api/waitlist`). The route uses `Promise.all` to await both email fetch dispatches to ensure the serverless function execution context doesn't freeze prematurely:
* **Applicant Confirmation**: Uses template ID `applicant_confirmation` to send a welcome email to the user.
* **Founder Notification**: Uses template ID `founder_notification` to alert the founder of a new registration.

### 4. Environment Variables (`.env.local`)
Create a `.env.local` file at the root of the project:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# EmailJS Configuration (Keep secure on the server)
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_token
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID_APPLICANT=applicant_confirmation
EMAILJS_TEMPLATE_ID_FOUNDER=founder_notification
```

---

*"The internet gave us infinite knowledge. Peerya gives us a team."*

