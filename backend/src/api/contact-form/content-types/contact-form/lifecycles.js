module.exports = {
    async beforeCreate(event) {
        console.log('beforeCreate event:', event.params.data);
    },
    
    async afterCreate(event) {
        console.log('afterCreate hook triggered:', event);

        try {
            await strapi.plugins['email'].services.email.send({
                to: `${event.result.email}`,
                subject: `${event.result.subject}`,
                text: `
          Message: ${event.result.message || 'N/A'}
        `,
            });

            console.log('Email sent successfully');
        } catch (err) {
            console.error('Failed to send email:', err.response ? err.response.body : err.message);
        }
    },
};