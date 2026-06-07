import { Resend } from 'resend'

let resend: Resend | null = null

const getResend = () => {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function sendNewDriveEmail(
  emails: string[],
  company: {
    id: string
    name: string
    ctc: number
    date: string
    type: string
  }
) {
  if (emails.length === 0) return

  const emailPromises = emails.map(email =>
    getResend().emails.send({
      from: 'PlacePrep <onboarding@resend.dev>',
      to: email,
      subject: `🏢 New Placement Drive — ${company.name}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background: #0a0c10; color: #f0f2f8; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #4f6ef7; font-size: 28px; margin: 0;">PlacePrep 🚀</h1>
              <p style="color: #6b7a9a; margin: 8px 0 0;">Your Placement Preparation Platform</p>
            </div>

            <div style="background: #1e2535; border: 1px solid #2e3650; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <div style="background: #4f6ef7; color: white; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px;">
                🎯 NEW PLACEMENT DRIVE
              </div>
              
              <h2 style="color: #f0f2f8; font-size: 24px; margin: 0 0 8px;">${company.name}</h2>
              <p style="color: #a8b3c8; margin: 0 0 24px;">${company.type} Company</p>

              <div style="display: grid; gap: 12px;">
                <div style="background: #161b27; border-radius: 10px; padding: 14px 18px; display: flex; justify-content: space-between;">
                  <span style="color: #6b7a9a; font-size: 13px;">💰 CTC Package</span>
                  <span style="color: #22c55e; font-weight: 600;">₹${company.ctc} LPA</span>
                </div>
                <div style="background: #161b27; border-radius: 10px; padding: 14px 18px; display: flex; justify-content: space-between;">
                  <span style="color: #6b7a9a; font-size: 13px;">📅 Drive Date</span>
                  <span style="color: #f0f2f8; font-weight: 600;">${company.date}</span>
                </div>
                <div style="background: #161b27; border-radius: 10px; padding: 14px 18px; display: flex; justify-content: space-between;">
                  <span style="color: #6b7a9a; font-size: 13px;">🏢 Type</span>
                  <span style="color: #f0f2f8; font-weight: 600;">${company.type}</span>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/companies/${company.id}" 
                style="background: #4f6ef7; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                View Drive & Register →
              </a>
            </div>

            <p style="color: #6b7a9a; font-size: 12px; text-align: center; margin: 0;">
              You received this email because you are registered on PlacePrep.<br/>
              © 2025 PlacePrep. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `
    })
  )

  await Promise.allSettled(emailPromises)
}