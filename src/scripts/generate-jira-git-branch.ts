import { createInterface } from 'node:readline';
import JiraApi from 'jira-client';
import OpenAI from 'openai';
import pc from 'picocolors';
import { $$ } from '../utils/zx-factory';

interface BranchGenerationOptions {
    pullFromMain?: boolean;
}

interface JiraIssue {
    key: string;
    fields: {
        summary: string;
        description?: string;
        issuetype: {
            name: string;
        };
    };
}

async function requestUserInput(prompt: string): Promise<string> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(pc.cyan(prompt), (answer: string) => {
            rl.close();
            const trimmedAnswer = answer.trim();
            if (trimmedAnswer) {
                console.log(pc.green(`→ ${trimmedAnswer}`));
            }
            resolve(trimmedAnswer);
        });
    });
}

function extractIssueKey(input: string): string | null {
    // Handle Jira URLs with /browse/ path: https://company.atlassian.net/browse/PROJ-123
    const browseMatch = input.match(/\/browse\/([A-Z]+-\d+)/);
    if (browseMatch) {
        return browseMatch[1];
    }

    // Handle Jira URLs with query parameters: ?selectedIssue=PROJ-123
    const queryMatch = input.match(/[?&](?:selectedIssue|issueKey)=([A-Z]+-\d+)/);
    if (queryMatch) {
        return queryMatch[1];
    }

    // Handle any Jira URL that contains an issue key pattern
    const urlMatch = input.match(/([A-Z]+-\d+)/);
    if (urlMatch) {
        return urlMatch[1];
    }

    // Handle direct issue keys: PROJ-123
    const keyMatch = input.match(/^([A-Z]+-\d+)$/);
    if (keyMatch) {
        return keyMatch[1];
    }

    return null;
}

function initializeJiraClient(): JiraApi {
    const jiraHost = process.env.JIRA_HOST;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraApiToken = process.env.JIRA_API_TOKEN;

    if (!jiraHost || typeof jiraHost !== 'string') {
        throw new Error('JIRA_HOST is not configured. Please set JIRA_HOST environment variable.');
    }

    if (!jiraEmail || typeof jiraEmail !== 'string') {
        throw new Error('JIRA_EMAIL is not configured. Please set JIRA_EMAIL environment variable.');
    }

    if (!jiraApiToken || typeof jiraApiToken !== 'string') {
        throw new Error('JIRA_API_TOKEN is not configured. Please set JIRA_API_TOKEN environment variable.');
    }

    return new JiraApi({
        protocol: 'https',
        host: jiraHost,
        username: jiraEmail,
        password: jiraApiToken,
        apiVersion: '2',
        strictSSL: true,
    });
}

async function fetchJiraIssue(issueKey: string): Promise<JiraIssue> {
    const jira = initializeJiraClient();

    try {
        console.log(`${pc.blue('🔍')} Fetching Jira issue: ${pc.bold(issueKey)}`);
        const issue = (await jira.findIssue(issueKey)) as JiraIssue;
        console.log(`${pc.green('✅')} Found issue: ${pc.bold(issue.fields.summary)}`);
        return issue;
    } catch (error) {
        console.error(pc.red('❌ Error fetching Jira issue:'), error);
        throw new Error(`Failed to fetch Jira issue ${issueKey}. Please check your credentials and issue key.`);
    }
}

async function generateBranchNameFromSummary(issueKey: string, summary: string): Promise<string> {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey || typeof openaiApiKey !== 'string') {
        throw new Error('OPENAI_API_KEY is not configured');
    }

    const openai = new OpenAI({
        apiKey: openaiApiKey,
    });

    const prompt = `Generate a short, descriptive git branch name based on this Jira issue summary.
The branch name should be:
- Start with the issue key (${issueKey})
- Followed by a dash
- Then a short, descriptive summary (max 30 characters to leave room for date)
- Use kebab-case (lowercase with hyphens)
- Avoid special characters except hyphens
- Be meaningful and related to the work
- DO NOT include any dates, timestamps, or time-related information
- Focus on the feature/change being implemented

Jira issue summary: ${summary}

Return only the branch name, nothing else.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 50,
            temperature: 0.3,
        });

        const branchName = completion.choices[0]?.message?.content?.trim();

        if (!branchName) {
            throw new Error('Failed to generate branch name from OpenAI');
        }

        // Clean up the branch name to ensure it's valid
        const cleanedBranchName = branchName
            .replace(/[^a-zA-Z0-9\-_/]/g, '-') // Replace invalid characters with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
            .replace(/\d{4}-\d{2}-\d{2}/g, '') // Remove date patterns (YYYY-MM-DD)
            .replace(/\d{2}-\d{2}-\d{4}/g, '') // Remove date patterns (MM-DD-YYYY)
            .replace(/-+/g, '-') // Replace multiple hyphens again after date removal
            .replace(/^-|-$/g, '') // Remove leading/trailing hyphens again
            .toLowerCase();

        // Add today's date in YYYY-MM-DD format
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Extract the issue key and keep it in original case, lowercase the rest
        const issueKeyPattern = new RegExp(`^(${issueKey})`, 'i'); // Case-insensitive match
        const match = cleanedBranchName.match(issueKeyPattern);

        if (match) {
            // Replace the issue key with the original case version
            const restOfBranchName = cleanedBranchName.replace(issueKeyPattern, '').replace(/^-/, '');
            return `${issueKey}-${restOfBranchName}-${dateString}`;
        }

        return `${cleanedBranchName}-${dateString}`;
    } catch (_error) {
        console.error('Error generating branch name:', _error);
        throw _error;
    }
}

async function createAndSwitchToBranch(branchName: string, options: BranchGenerationOptions = {}): Promise<void> {
    const { pullFromMain = true } = options;
    let hasStashed = false;

    try {
        if (pullFromMain) {
            console.log(pc.yellow('📥 Updating main branch with latest changes...'));
            try {
                // Check for uncommitted changes
                const statusResult = await $$`git status --porcelain`;
                const hasUncommittedChanges = statusResult.stdout.trim().length > 0;

                if (hasUncommittedChanges) {
                    console.log(pc.yellow('\n⚠️  You have uncommitted changes.'));
                    const stashResponse = await requestUserInput('Would you like to stash them and continue? (y/n, default: y): ');

                    if (stashResponse.toLowerCase() !== 'n' && stashResponse.toLowerCase() !== 'no') {
                        console.log(pc.blue('📦 Stashing uncommitted changes...'));
                        await $$`git stash push -m "Auto-stash before branch creation"`;
                        hasStashed = true;
                        console.log(pc.green('✅ Changes stashed successfully'));
                    } else {
                        console.log(pc.red('❌ Branch creation cancelled. Please commit or stash your changes manually.'));
                        process.exit(0);
                    }
                }

                // Switch to main branch
                await $$`git checkout main`;

                // Pull latest changes from origin/main
                await $$`git pull origin main`;

                console.log(pc.green('✅ Successfully updated main branch'));
            } catch (_error) {
                console.warn(pc.yellow('⚠️  Warning: Could not update main branch. Continuing with current state.'));
            }
        }

        console.log(`\n${pc.blue('🔄')} Creating branch: ${pc.bold(branchName)}`);

        // Create and switch to the new branch from main (or current branch if pullFromMain is false)
        await $$`git checkout -b ${branchName}`;

        console.log(`\n${pc.green('🎉')} Successfully created and switched to branch: ${pc.bold(pc.green(branchName))}`);

        // Pop stashed changes if we stashed earlier
        if (hasStashed) {
            console.log(pc.blue('\n📦 Restoring stashed changes...'));
            try {
                await $$`git stash pop`;
                console.log(pc.green('✅ Stashed changes restored successfully'));
            } catch (_error) {
                console.warn(pc.yellow('⚠️  Warning: Could not automatically restore stashed changes. Use "git stash pop" manually.'));
            }
        }

        console.log(`${pc.cyan('📝')} Ready to start working on: ${pc.bold(branchName)}`);
    } catch (_error) {
        console.error(pc.red(`Git command failed`));
        process.exit(1);
    }
}

async function main(): Promise<void> {
    try {
        console.log(pc.bold(pc.blue('🚀 Jira Git Branch Generator')));
        console.log(pc.blue('=============================\n'));

        // Request Jira issue from user
        const jiraInput = await requestUserInput('Enter Jira issue (URL or issue key, e.g., PROJ-123): ');

        if (!jiraInput) {
            console.error(pc.red('❌ Jira issue input cannot be empty'));
            process.exit(1);
        }

        // Extract issue key from input
        const issueKey = extractIssueKey(jiraInput);
        if (!issueKey) {
            console.error(pc.red('❌ Invalid Jira issue format. Please provide a valid issue key (e.g., PROJ-123) or Jira URL.'));
            process.exit(1);
        }

        // Fetch Jira issue details
        const jiraIssue = await fetchJiraIssue(issueKey);

        // Ask user if they want to provide a custom description or use Jira summary
        const customDescription = await requestUserInput('\nEnter custom work description (or press Enter to use Jira summary): ');

        let workDescription: string;
        if (customDescription) {
            workDescription = customDescription;
        } else {
            workDescription = jiraIssue.fields.summary;
        }

        // Ask about pulling from main
        const pullFromMainInput = await requestUserInput('\nPull latest changes from main after creating branch? (y/n, default: y): ');
        const pullFromMain = pullFromMainInput.toLowerCase() !== 'n' && pullFromMainInput.toLowerCase() !== 'no';

        console.log(`\n${pc.magenta('🤖')} Generating branch name with AI...`);

        // Generate branch name using OpenAI
        const branchName = await generateBranchNameFromSummary(issueKey, workDescription);

        console.log(`${pc.green('✨')} Generated branch name: ${pc.bold(pc.green(branchName))}`);

        // Confirm with user
        const confirm = await requestUserInput(`\nCreate branch "${pc.bold(branchName)}"? (y/n, default: y): `);

        if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
            console.log(pc.red('❌ Branch creation cancelled'));
            process.exit(0);
        }

        // Create and switch to the branch
        await createAndSwitchToBranch(branchName, { pullFromMain });
    } catch (error) {
        console.error(pc.red('❌ Error:'), error);
        process.exit(1);
    }
}

main();
