// controllers/termsController.js

// Static terms and conditions
const termsAndConditions = `
    <h2>Terms and Conditions</h2>
    <p>Welcome to our application! These terms and conditions outline the rules and regulations for the use of our service.</p>
    
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing this application, you accept these terms and conditions in full. If you disagree with any part of these terms, you must not use our application.</p>
    
    <h3>2. Changes to Terms</h3>
    <p>We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on this page. Your continued use of the application after any changes constitutes your acceptance of the new terms.</p>
    
    <h3>3. User Responsibilities</h3>
    <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
    
    <h3>4. Limitation of Liability</h3>
    <p>In no event shall we be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the application.</p>
    
    <h3>5. Governing Law</h3>
    <p>These terms shall be governed by and construed in accordance with the laws of [Your Country/State].</p>
    
    <h3>6. Contact Us</h3>
    <p>If you have any questions about these terms, please contact us at [Your Contact Information].</p>
`;

exports.getTerms = (req, res) => {
    res.status(200).send(termsAndConditions);
};