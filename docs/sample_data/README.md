# Sample CSV Test Files

This folder contains sample CSV files for testing the ProductLogik upload functionality.

## Files

### 1. `jira_export.csv`
**Format**: Jira issue export
**Columns**: Issue Key, Summary, Description, Issue Type, Status, Priority, Created, Reporter
**Rows**: 13 feedback items
**Use Case**: Product bugs, feature requests, and improvements from Jira

### 2. `zendesk_export.csv`
**Format**: Zendesk support ticket export
**Columns**: Ticket ID, Subject, Description, Status, Priority, Created Date, Requester Email, Category
**Rows**: 14 customer support tickets
**Use Case**: Customer support feedback and issues

### 3. `surveymonkey_export.csv`
**Format**: SurveyMonkey survey responses
**Columns**: Response ID, Submitted At, Question 1-4 (satisfaction, likes, improvements, recommendation)
**Rows**: 20 survey responses
**Use Case**: Customer satisfaction surveys

### 4. `generic_feedback.csv`
**Format**: Simple feedback format
**Columns**: Feedback ID, Source, Feedback Text, Date Submitted
**Rows**: 20 feedback items from various sources
**Use Case**: Mixed feedback from app stores, social media, emails, etc.

## Agile Anti-Pattern & Health Score Test Data

These files simulate internal product team updates and stakeholder requests to explicitly trigger the AI's organizational dysfunction detection.

### 5. `health_good_alignment.csv`
**Severity**: None (Excellent Alignment)
**Content**: Highly outcome-driven teams prioritizing user validation, A/B testing, and strategy over mere output.

### 6. `health_medium_risk.csv`
**Severity**: Low/Medium Risk
**Content**: A mix of standard operations with creeping warning signs (a few arbitrary deadlines and minor executive meddling).

### 7. `health_bad_factory.csv`
**Severity**: High Risk (Feature Factory)
**Content**: Obsessive focus on story points, velocity, and shipping volume. No mention of metrics, validation, or actual user outcomes.

### 8. `health_worse_critical.csv`
**Severity**: Critical (The HiPPO Effect & Build Trap)
**Content**: Severe team dysfunction. The CEO/Sales VP dictate the roadmap based on whims or specific deals. High team frustration and zero autonomy.

## Testing Scenarios

Use these files to test:
- ✅ Different CSV formats and column structures
- ✅ Various feedback sources (Jira, Zendesk, surveys, etc.)
- ✅ Different row counts (13-20 rows)
- ✅ Multiple text columns (Description, Feedback Text, etc.)
- ✅ Metadata extraction (source, priority, category, etc.)

## How to Use

1. Navigate to `/upload` in the ProductLogik app
2. Drag and drop any of these CSV files
3. Click "Run Analysis"
4. The system will automatically detect the feedback text column and extract insights

## Expected Behavior

The upload system should:
- Accept all these CSV formats
- Automatically identify the main feedback text column
- Extract metadata from other columns (source, priority, etc.)
- Store all feedback entries in the database
- Trigger AI analysis to extract themes and insights
