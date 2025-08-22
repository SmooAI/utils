import { createInterface } from 'node:readline';
import OpenAI from 'openai';
import pc from 'picocolors';
import { $$ } from '../utils/zx-factory';

interface BranchGenerationOptions {
    pullFromMain?: boolean;
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

async function generateBranchName(workDescription: string): Promise<string> {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey || typeof openaiApiKey !== 'string') {
        throw new Error('OPENAI_API_KEY is not configured');
    }

    const openai = new OpenAI({
        apiKey: openaiApiKey,
    });

    const prompt = `Generate a git branch name for the following work description.
The branch name should be:
- Descriptive but concise (max 40 characters to leave room for date)
- Use kebab-case (lowercase with hyphens)
- Avoid special characters except hyphens
- Be meaningful and related to the work
- DO NOT include any dates, timestamps, or time-related information
- Focus on the feature/change being implemented

Work description: ${workDescription}

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
        console.log(pc.bold(pc.blue('🚀 Git Branch Generator')));
        console.log(pc.blue('======================\n'));

        // Request work description from user
        const workDescription = await requestUserInput('Please describe the work you want to do: ');

        if (!workDescription) {
            console.error(pc.red('❌ Work description cannot be empty'));
            process.exit(1);
        }

        // Ask about pulling from main
        const pullFromMainInput = await requestUserInput('\nPull latest changes from main after creating branch? (y/n, default: y): ');
        const pullFromMain = pullFromMainInput.toLowerCase() !== 'n' && pullFromMainInput.toLowerCase() !== 'no';

        console.log(`\n${pc.magenta('🤖')} Generating branch name with AI...`);

        // Generate branch name using OpenAI
        const branchName = await generateBranchName(workDescription);

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
