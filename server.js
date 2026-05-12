// server.js - Backend para enviar emails para solutionscumbe@gmail.com
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verificar se a senha foi carregada
console.log('📧 Configuração de email:');
console.log('   Email:', 'solutionscumbe@gmail.com');
console.log('   Senha:', process.env.EMAIL_PASSWORD ? '✅ Carregada' : '❌ NÃO CARREGADA');

// Configuração do Email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'solutionscumbe@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verificar conexão com o Gmail
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erro na conexão com Gmail:', error.message);
    } else {
        console.log('✅ Conexão com Gmail estabelecida!');
    }
});

// Rota para receber solicitações de contato
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;
    
    console.log(`\n📥 Nova solicitação de: ${name} (${email})`);
    console.log(`   Serviço: ${service}`);
    console.log(`   Telefone: ${phone || 'Não informado'}`);
    
    try {
        // Email para o administrador
        const adminMailOptions = {
            from: `"CumbeSolutions Site" <solutionscumbe@gmail.com>`,
            to: 'solutionscumbe@gmail.com',
            replyTo: email,
            subject: `🔔 NOVA SOLICITAÇÃO - ${name} - ${service}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; }
                        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #1e293b; }
                        .value { color: #334155; margin-top: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>🎯 CumbeSolutions</h2>
                            <p>Nova Solicitação de Serviço</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">👤 Cliente:</div>
                                <div class="value">${name}</div>
                            </div>
                            <div class="field">
                                <div class="label">📧 Email:</div>
                                <div class="value">${email}</div>
                            </div>
                            <div class="field">
                                <div class="label">📞 Telefone/WhatsApp:</div>
                                <div class="value">${phone || 'Não informado'}</div>
                            </div>
                            <div class="field">
                                <div class="label">🎯 Serviço:</div>
                                <div class="value">${service}</div>
                            </div>
                            <div class="field">
                                <div class="label">💬 Mensagem:</div>
                                <div class="value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            <div class="field">
                                <div class="label">📅 Data:</div>
                                <div class="value">${new Date().toLocaleString('pt-BR')}</div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        // Email de confirmação para o cliente
        const clientMailOptions = {
            from: `"CumbeSolutions" <solutionscumbe@gmail.com>`,
            to: email,
            subject: '✅ CumbeSolutions - Recebemos sua solicitação!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; }
                        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; }
                        .btn { background: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
                        .footer { font-size: 12px; color: #64748b; margin-top: 20px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>✅ CumbeSolutions</h2>
                        </div>
                        <div class="content">
                            <h3>Olá ${name}!</h3>
                            <p>Recebemos sua solicitação de <strong>${service}</strong>!</p>
                            <p>Entraremos em contato em breve pelo WhatsApp ou email.</p>
                            <p><strong>Resumo da sua solicitação:</strong><br>${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
                            <a href="https://wa.me/258844124493" class="btn">💬 Falar agora no WhatsApp</a>
                            <div class="footer">
                                <hr>
                                <p>Este é um email automático. Respondemos em até 2 horas úteis.</p>
                                <p>© 2026 CumbeSolutions - Todos os direitos reservados</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        await transporter.sendMail(adminMailOptions);
        console.log('   ✅ Email enviado para o administrador');
        
        await transporter.sendMail(clientMailOptions);
        console.log('   ✅ Email de confirmação enviado para o cliente');
        
        res.json({ success: true, message: 'Solicitação enviada com sucesso!' });
        
    } catch (error) {
        console.error('   ❌ Erro no envio:', error.message);
        res.status(500).json({ success: false, message: 'Erro ao enviar: ' + error.message });
    }
});

// Rota para newsletter
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    
    console.log(`\n📧 Nova inscrição newsletter: ${email}`);
    
    try {
        const mailOptions = {
            from: `"CumbeSolutions" <solutionscumbe@gmail.com>`,
            to: 'solutionscumbe@gmail.com',
            subject: '📧 Nova inscrição Newsletter',
            html: `
                <h3>Nova inscrição na Newsletter</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('   ✅ Notificação enviada');
        res.json({ success: true });
        
    } catch (error) {
        console.error('   ❌ Erro:', error.message);
        res.status(500).json({ success: false });
    }
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'online', 
        email: 'solutionscumbe@gmail.com',
        whatsapp: '258844124493',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     🚀 CumbeSolutions - Servidor Online!                 ║
╠══════════════════════════════════════════════════════════╣
║  📍 URL: http://localhost:${PORT}                         ║
║  📧 Email: solutionscumbe@gmail.com                      ║
║  💬 WhatsApp: 258844124493                               ║
║  ✅ Status: Aguardando solicitações...                   ║
╚══════════════════════════════════════════════════════════╝
    `);
});
