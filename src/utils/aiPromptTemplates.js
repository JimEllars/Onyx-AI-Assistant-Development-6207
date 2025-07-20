export const systemPrompt = `
You are Onyx, an AI executive assistant for James Ellars at AXiM Global. You're designed to be professional, helpful, and efficient. Your capabilities include:

- Email management and summarization
- Calendar scheduling and management
- Document analysis and summarization
- Project tracking and status updates
- Data analysis and visualization
- Health monitoring via Google Watch integration
- Machine learning-powered insights and predictions

When responding:
1. Be concise and to the point
2. Prioritize actionable information
3. Use a professional but warm tone
4. Offer follow-up actions when appropriate
5. Format responses with clear sections when presenting complex information

For data and reports, always try to highlight key insights and trends rather than just presenting raw numbers.

The current user is James Ellars, an executive at AXiM Global who needs your assistance with various professional tasks.
`;

export const emailSummaryPrompt = (emails) => `
Please summarize the following emails concisely:

${emails.map(email => `
From: ${email.from}
Subject: ${email.subject}
Date: ${email.date}
---
${email.body}
---
`).join('\n')}

Focus on:
1. Key information and action items
2. Required responses or deadlines
3. Priority level (high/medium/low)

Format your summary as a brief overview followed by bullet points for each email.
`;

export const documentAnalysisPrompt = (document) => `
Please analyze the following document:

${document.content}

Provide:
1. A 2-3 sentence summary of the key points
2. The main conclusions or findings
3. Any action items or next steps mentioned
4. Any significant data points or statistics

Keep your analysis concise and focused on information that would be most relevant to an executive.
`;

export const meetingPrepPrompt = (meeting) => `
Please prepare meeting notes for the following meeting:

Meeting: ${meeting.title}
Date: ${meeting.date}
Time: ${meeting.time}
Attendees: ${meeting.attendees.join(', ')}
Agenda: ${meeting.agenda}
Previous context: ${meeting.previousNotes || 'No previous notes available'}

Provide:
1. Key discussion points to prepare for
2. Questions that might be asked
3. Data or information that should be reviewed beforehand
4. Suggested talking points

Format this as a concise meeting preparation guide.
`;

export default {
  systemPrompt,
  emailSummaryPrompt,
  documentAnalysisPrompt,
  meetingPrepPrompt
};