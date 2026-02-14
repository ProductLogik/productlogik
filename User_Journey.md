# User Journey Map — ProductLogik: Logic-Driven Product Intelligence

**Persona**: Sarah, a Product Owner at a growing SaaS startup.
**Context**: Sarah is drowning in feedback from Jira, Intercom, and Slack. She feels anxious about the upcoming roadmap meeting because she lacks evidence to back her decisions.

---

## Phase 1: Discovery & Onboarding (The "Hook")

### Step 1: Landing Page
*   **Action**: Sarah lands on ProductLogik.
*   **Trigger**: Finds it via a Google search for "AI product feedback analyzer".
*   **Experience**: She sees a headline "Turn 500 Jira Tickets into 3 Priorities in Seconds."
*   **Key Interaction**: She drags a sample CSV (provided on page) into a "Live Demo" box to see instant magic.
*   **Outcome**: "Wow, that actually understood the issue." She clicks **"Start for Free"**.

### Step 2: Sign Up
*   **Action**: Creates an account.
*   **Experience**: Simple Email/Password form. No complex surveys.
*   **Outcome**: Account created. She is redirected strictly to the **New Project** screen.

---

## Phase 2: The Core Loop (The "Action")

### Step 3: Data Ingestion
*   **Action**: Sarah needs to get her real data in.
*   **UI interaction**: She exports a CSV from Jira (last 3 months of tickets).
*   **Upload**: She drags the file into ProductLogik.
*   **Mapping**: The system asks: "Which column contains the text?" -> Sarah selects "Summary".
*   **State**: A progress bar appears: "Analyzing 450 items... Identifying themes... checking for Agile risks..."
*   **Time**: ~45 seconds.

### Step 4: The "Aha!" Moment (Results Dashboard)
*   **Action**: The analysis completes. The Dashboard loads.
*   **First Glance**:
    1.  **Executive Summary**: She sees a big card: **"Top Priority: Mobile Login Failures (High Risk)"**.
    2.  **Validation**: She thinks "I knew it! But now I have proof."
    3.  **Surprise**: She sees a secondary theme: "Export Button Hidden". She hadn't realized this was a major pain point.

### Step 5: Drill Down & Verify
*   **Action**: She clicks the "Mobile Login" theme.
*   **Experience**: The card expands. She sees 15 specific quotes from her CSV: "Can't login on iOS," "FaceID failed," etc.
*   **Outcome**: Trust established. The AI isn't making things up; it's summarizing her actual data.

### Step 6: Agile Health Check (The "Bonus")
*   **Action**: She notices the "Agile Health" side panel.
*   **Insight**: It says: **"⚠️ Feature Factory Detected"**.
*   **Detail**: "You have shipped 20 items labeled 'New Feature' but 0 items labeled 'Improvement' or 'Validation' in this batch."
*   **Reaction**: A bit of guilt, but appreciation. "Okay, we need to focus on quality next sprint."

---

## Phase 3: Sharing & Value Realization (The "Goal")

### Step 7: Exporting the Evidence
*   **Action**: Sarah has her roadmap meeting in 1 hour.
*   **Interaction**: She clicks **"Export PDF Report"**.
*   **Output**: A clean, branded PDF summary of the Top 3 Themes and the Agile Health warning.

### Step 8: The Meeting
*   **Action**: Sarah presents the PDF to the CEO.
*   **Dialogue**:
    *   CEO: "We need to build the new Chat feature."
    *   Sarah: "I'd love to, but our data shows that 40% of our support tickets are about Login Failures. If we fix this, we save 20 hours of support time a week."
*   **Outcome**: The CEO agrees. The Login Fix is prioritized.

### Step 9: Retention
*   **Action**: Sarah logs out.
*   **Follow-up**: 1 week later, she gets an email: "Ready to analyze your next sprint?"
*   **Result**: She returns to upload the next batch of data.
