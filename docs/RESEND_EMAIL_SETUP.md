# Resend Email Setup Guide

## Quick Setup (5 minutes)

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### 2. Get API Key
1. Go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it: `ProductLogik`
4. Copy the API key (starts with `re_...`)

### 3. Configure Backend
Update `backend/.env`:
```bash
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=ProductLogik <onboarding@resend.dev>
FRONTEND_URL=http://localhost:5173
```

### 4. Test Email
```bash
# Restart backend
./stop.sh
./start.sh

# Share an upload with your email
# You should receive a branded email!
```

---

## Free Tier Limits

✅ **3,000 emails/month**  
✅ **100 emails/day**  
✅ **No credit card required**  

Perfect for:
- Development
- Small teams
- MVP/testing

---

## Email Templates

### Invitation Email (Unregistered Users)
- **Subject**: `{Name} invited you to view feedback analysis`
- **CTA**: Create Free Account & View Analysis
- **Design**: Emerald green gradient header, clean modern layout

### Share Notification (Registered Users)
- **Subject**: `{Name} shared "{filename}" with you`
- **CTA**: View Analysis Now
- **Design**: Matches invitation email style

---

## Custom Domain (Optional)

For production, use your own domain:

1. **Add Domain** in Resend dashboard
2. **Verify DNS** records
3. **Update** `FROM_EMAIL` in `.env`:
   ```bash
   FROM_EMAIL=ProductLogik <noreply@yourdomain.com>
   ```

---

## Troubleshooting

### Emails Not Sending?
```bash
# Check backend logs for:
✅ Email service initialized (Resend)
✅ Invitation email sent to user@example.com

# If you see:
⚠️  Email service disabled (no RESEND_API_KEY)
# → Add your API key to .env
```

### Emails in Spam?
- Use custom domain (not resend.dev)
- Add SPF/DKIM records
- Warm up your domain gradually

---

## Cost Breakdown

| Tier | Emails/Month | Cost |
|------|--------------|------|
| **Free** | 3,000 | $0 |
| **Pro** | 50,000 | $20 |
| **Scale** | 100,000 | $80 |

**Your Usage Estimate:**
- 10 shares/day = 300 emails/month = **FREE**
- 50 shares/day = 1,500 emails/month = **FREE**
- 100 shares/day = 3,000 emails/month = **FREE**

---

## Summary

**Setup Time**: 5 minutes  
**Cost**: FREE (3k emails/month)  
**Design**: Branded with Emerald green theme  
**Status**: Ready to use!

Just add your API key and start sharing! 🚀
