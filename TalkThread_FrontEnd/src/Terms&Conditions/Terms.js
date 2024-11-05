import React from 'react';
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box >
    <Container maxWidth="md" sx={{ py: 4, overflowY: 'auto', maxHeight: '80vh',marginTop:"3%" }}>
      <Typography variant="h4" gutterBottom>
        Terms and Conditions
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <strong>Effective Date:</strong> 7/11/2024
      </Typography>

      <Typography variant="h5" gutterBottom>
        Welcome to TalkThread!
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms and Conditions (“Terms”) govern your use of TalkThread (the “Service”), provided by TalkThread .
        By accessing or using our Service, you agree to be bound by these Terms. If you do not
        agree with any part of these Terms, please do not use our Service.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Acceptance of Terms
      </Typography>
      <Typography variant="body1" paragraph>
        By creating an account and using TalkThread, you confirm that you accept these Terms and agree to abide by them.
        These Terms apply to all visitors, users, and others who access or use the Service.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Eligibility
      </Typography>
      <Typography variant="body1" paragraph>
        To use TalkThread, you must be at least 13 years old or the minimum legal age in your country, whichever is
        higher. By using our Service, you confirm that you meet this age requirement.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Account Registration and Security
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Account Creation"
            secondary="To access certain features, you must register an account with accurate and current information. Failure to provide accurate information may result in the termination of your account."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Account Security"
            secondary="You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Account Termination"
            secondary="We reserve the right to suspend or terminate your account if we believe you have violated these Terms or engaged in conduct that may harm other users or the Service."
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom>
        4. User Conduct and Content
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="User Content"
            secondary="You are solely responsible for the content you post, share, or display on the Service, including any text, images, videos, and other materials (“User Content”)."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Content License"
            secondary="By posting User Content on TalkThread, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute your User Content in connection with the Service."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Prohibited Content"
            secondary="You agree not to post or share content that violates any laws or regulations, contains offensive or inappropriate material, infringes upon others' rights, contains malware, or harasses other users."
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom>
        5. Privacy
      </Typography>
      <Typography variant="body1" paragraph>
        Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect
        your information. By using our Service, you agree to the data practices described in our Privacy Policy.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Intellectual Property Rights
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Ownership"
            secondary="TalkThread and all related materials, including trademarks, logos, and software, are owned by TalkThread Inc. and are protected by copyright and trademark laws."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="License to Use"
            secondary="We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes."
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom>
        7. Termination
      </Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to suspend or terminate your access to the Service at any time, without notice, if we
        believe you have violated these Terms or engaged in harmful or inappropriate behavior. Upon termination, your
        right to use the Service will immediately cease.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        To the maximum extent permitted by law, TalkThread Inc. and its affiliates, directors, employees, and agents
        shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or
        related to your use of the Service.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Disclaimer of Warranties
      </Typography>
      <Typography variant="body1" paragraph>
        The Service is provided “as is” and “as available,” without warranties of any kind, either express or implied.
        We do not guarantee that the Service will be uninterrupted, secure, or error-free.
      </Typography>

      <Typography variant="h6" gutterBottom>
        10. Modifications to the Terms
      </Typography>
      <Typography variant="body1" paragraph>
        We may revise these Terms from time to time. We will notify you of any changes by posting the updated Terms on
        our website and updating the Effective Date. Your continued use of the Service after such changes constitutes
        acceptance of the new Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        11. Governing Law
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms are governed by the laws of [India]. Any disputes arising under these Terms shall be
        resolved in the courts of [Supreme Court].
      </Typography>

      <Typography variant="h6" gutterBottom>
        12. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about these Terms, please contact us at [contact email or phone number].
      </Typography>

      <Typography variant="h6" gutterBottom>
        Acceptance of Terms and Conditions
      </Typography>
      <Typography variant="body1" paragraph>
        By using TalkThread, you confirm that you have read, understood, and agree to these Terms and our Privacy
        Policy.
      </Typography>
    </Container>
    </Box>
  );
};

export default TermsAndConditions;
