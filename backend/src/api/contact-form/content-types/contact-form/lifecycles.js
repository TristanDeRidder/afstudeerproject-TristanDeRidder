export default {
    async afterCreate(event) {
        console.log('afterCreate hook triggered:', event);

        try {
            await strapi.plugins['email'].services.email.send({
                to: 'mixmaster578@gmail.com',
                from: 'tristanderidder1@gmail.com',
                subject: 'New Contact Form Submission',
                text: `
          Name: ${event.result.name}
          Email: ${event.result.email}
          Message: ${event.result.message}
        `,
            });

            console.log('Email sent successfully');
        } catch (err) {
            console.error('Failed to send email:', err.response ? err.response.body : err.message);
        }
    }
};