# AI Schema & Build Context

## Purpose
Help AI assistants understand app structure, data model, and purpose.

## Entities
- Ticket { id, question, attachments[], detectedIssue }
- Solution { id, title, category, description, steps[], source, sourceUrl, confidence, icon }
- UI State { feedback, tags, searchQuery, showResponsePanel, generatedResponse, attachments }

## Architecture
- src/constants/constants.ts → constants + demo ticket
- src/data/solutions.ts → curated solution cards
- src/lib/ui.ts → helper functions
- src/components/VectorStoreSupportTool.tsx → main UI component
- src/__tests__/helpers.test.ts → sanity checks
