const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require("path");
const {
    _sesAwsId, _sesAwsSecret,
} = require('./settings-helper');z

exports.sendMail = async (toAddress, subject, template, data) => {
    try {
        let transporter = nodemailer.createTransport({
            host: `${process.env.SMTP_HOST}`,
            port: `${process.env.SMTP_PORT}`,
            secure: process.env.SMTP_SECURE == 1 ? true : false,
            auth: {
                user: _sesAwsId, pass: _sesAwsSecret,
            },
        });

        const templateDir = path.join(process.cwd(), 'views', 'email-templates');

        const handlebarOptions = {
            viewEngine: {
                extName: ".html", partialsDir: templateDir, defaultLayout: false,
            }, viewPath: templateDir, extName: ".html",
        };

        transporter.use('compile', hbs(handlebarOptions))

        // Assign The Base URL
        Object.assign(data, {
            baseUrl: `https://${process.env.HTTP_URL}`,
            projectName: process.env.PROJECT_NAME,
        });

        let info = await transporter.sendMail({
            from: `"${process.env.PROJECT_NAME}" <${process.env.SMTP_MAIL_ADDRESS}>`,
            to: toAddress,
            subject: subject,
            template: template,
            context: data,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}