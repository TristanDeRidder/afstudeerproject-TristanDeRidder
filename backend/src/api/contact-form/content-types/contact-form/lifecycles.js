module.exports = {
    async afterCreate(event) {
        const {result} = event;

        try {
            await strapi.plugins['email'].services.email.send({
                to: 'mixmaster578@gmail.com',
                from: 'tristanderidder1@gmail.com',
                subject: 'New Contact Form Submission',
                text: `
                    Name: ${result.name}
                    Email: ${result.email}
                    Message: ${result.message}
                `
            });
        } catch (error) {
            console.error(error);
            
        }
    }
}