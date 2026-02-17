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
