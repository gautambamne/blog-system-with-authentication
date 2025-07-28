# Email Deliverability Setup Guide for mail.nextstore.fun

## 🚨 IMPORTANT: Steps to Avoid Spam Folder

### 1. DNS Records Setup (CRITICAL)
Add these DNS records to your domain registrar for `nextstore.fun`:

#### SPF Record:
```
Type: TXT
Name: mail.nextstore.fun (or just mail)
Value: v=spf1 include:_spf.resend.com ~all
```

#### DKIM Record:
```
Type: TXT  
Name: resend._domainkey.mail.nextstore.fun
Value: [Get this from your Resend dashboard under Domain settings]
```

#### DMARC Record:
```
Type: TXT
Name: _dmarc.mail.nextstore.fun  
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@nextstore.fun
```

#### MX Record (Optional but recommended):
```
Type: MX
Name: mail.nextstore.fun
Value: feedback-smtp.resend.com
Priority: 10
```

### 2. Resend Domain Verification
1. Go to your Resend dashboard
2. Navigate to Domains section
3. Add domain: `mail.nextstore.fun`
4. Copy the verification records
5. Add them to your DNS
6. Wait for verification (can take up to 72 hours)

### 3. Additional Improvements Made:

#### ✅ Email Headers Added:
- `X-Priority: 1` (High priority)
- `X-MSMail-Priority: High`
- `Importance: high`

#### ✅ Professional HTML Templates:
- Proper DOCTYPE and meta tags
- Mobile-responsive design
- Professional branding
- Clear call-to-action
- Plain text fallback

#### ✅ Subject Line Optimization:
- Clear, specific subjects
- Brand name included
- Action-oriented

### 4. Best Practices Implemented:

#### Content Quality:
- ✅ Professional HTML structure
- ✅ Text version included
- ✅ Clear branding
- ✅ Specific purpose
- ✅ No spam trigger words

#### Technical:
- ✅ Proper from address format
- ✅ High priority headers
- ✅ Mobile responsive
- ✅ Valid HTML structure

### 5. Next Steps:

1. **Set up DNS records** (most important!)
2. **Verify domain** in Resend dashboard
3. **Test emails** to different providers (Gmail, Outlook, Yahoo)
4. **Monitor delivery** rates in Resend analytics
5. **Add unsubscribe** link if sending marketing emails

### 6. Testing Checklist:

- [ ] DNS records added and propagated
- [ ] Domain verified in Resend
- [ ] Test email to Gmail
- [ ] Test email to Outlook  
- [ ] Test email to Yahoo
- [ ] Check spam score using mail-tester.com

### 7. If Still Going to Spam:

1. **Warm up your domain** - Send emails gradually
2. **Ask recipients** to mark as "Not Spam"
3. **Monitor bounce rates** - Keep under 5%
4. **Check blacklists** - Use MXToolbox
5. **Contact Resend support** for reputation help

### 8. Environment Variables Check:
```env
RESEND_API_KEY="re_g3Mf3NvJ_ASVw1iAX7ss2tPWF7Noo1Hn8"
FROM_EMAIL="noreply@mail.nextstore.fun"
```

✅ **Most Important**: Set up SPF, DKIM, and DMARC records!
