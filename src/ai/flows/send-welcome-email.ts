'use server';
/**
 * @fileOverview A Genkit flow for sending a welcome email to new users.
 * 
 * - sendWelcomeEmail - A function that sends a welcome email.
 * - WelcomeEmailInput - The input type for the sendWelcomeEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const WelcomeEmailInputSchema = z.object({
  name: z.string().describe('The name of the new user.'),
  email: z.string().email().describe('The email address of the new user.'),
});
export type WelcomeEmailInput = z.infer<typeof WelcomeEmailInputSchema>;

// This is an unexported function that creates the email's HTML content.
const createEmailHtml = (name: string): string => `
  <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 8px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="color: #34D399;"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
        <path d="M12 18V6"></path>
      </svg>
      <h1 style="font-size: 24px; font-weight: bold; margin: 0;">PennyPincher365</h1>
    </div>
    <h2 style="font-size: 22px;">Welcome, ${name}!</h2>
    <p style="font-size: 16px;">
      Your PennyPincher365 account has been successfully created. We're excited to have you on board.
    </p>
    <p style="font-size: 16px;">
      You can now log in to your account and start managing your finances.
    </p>
    <a
      href="https://your-app-url/login"
      style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #34D399; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;"
    >
      Go to Dashboard
    </a>
  </div>
`;

// Define the Genkit flow for sending the email.
const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: WelcomeEmailInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'your-resend-api-key-here') {
      console.warn('Resend API key is not configured. Skipping email sending.');
      return;
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: 'PennyPincher365 <info@microtech365.com>',
        to: input.email,
        subject: 'Welcome to PennyPincher365!',
        html: createEmailHtml(input.name),
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // It's often best not to throw an error here to avoid failing the whole sign-up process.
    }
  }
);

// This is the exported function that your application will call.
export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<void> {
  await sendWelcomeEmailFlow(input);
}