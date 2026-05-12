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

console.log('📧 Configuração de email:');
console.log('   Email:', 'solutionscumbe@gmail.com');
console.log('   Senha:', process.env.EMAIL_PASSWORD ? '✅ Carregada' : '❌ NÃO CARREGADA');

// CONFIGURAÇÃO CORRETA DO GMAIL
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // false para porta 587
    auth: {
        user: 'solutionscumbe@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000
});

// Testar conexão (opcional, pode remover se der erro)
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erro na conexão com Gmail:', error.message);
        console.log('⚠️ Tentando configuração alternativa...');
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
            from: `"CumbeSolutions" <solutionscumbe@gmail.com>`,
            to: 'solutionscumbe@gmail.com',
            replyTo: email,
            subject: `🔔 NOVA SOLICITAÇÃO - ${name} - ${service}`,
            html: `
                <h2>🎯 Nova Solicitação de Serviço</h2>
                <p><strong>👤 Cliente:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>📞 Telefone:</strong> ${phone || 'Não informado'}</p>
                <p><strong>🎯 Serviço:</strong> ${service}</p>
                <p><strong>💬 Mensagem:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <p><strong>📅 Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            `
        };
        
        // Email de confirmação para o cliente
        const clientMailOptions = {
            from: `"CumbeSolutions" <solutionscumbe@gmail.com>`,
            to: email,
            subject: '✅ CumbeSolutions - Recebemos sua solicitação!',
            html: `
                <h2>Olá ${name}!</h2>
                <p>Recebemos sua solicitação de <strong>${service}</strong>!</p>
                <p>Entraremos em contato em breve pelo WhatsApp: <strong>+258 84 412 4493</strong></p>
                <p>Resumo da sua solicitação:<br>${message.substring(0, 200)}</p>
                <br>
                <p>Atenciosamente,<br>CumbeSolutions</p>
            `
        };
        
        await transporter.sendMail(adminMailOptions);
        console.log('   ✅ Email enviado para o administrador');
        
        await transporter.sendMail(clientMailOptions);
        console.log('   ✅ Email de confirmação enviado para o cliente');
        
        res.json({ success: true, message: 'Solicitação enviada com sucesso!' });
        
    } catch (error) {
        console.error('   ❌ Erro no envio:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Rota para newsletter
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    
    console.log(`\n📧 Nova inscrição newsletter: ${email}`);
    
    try {
        await transporter.sendMail({
            from: `"CumbeSolutions" <solutionscumbe@gmail.com>`,
            to: 'solutionscumbe@gmail.com',
            subject: '📧 Nova inscrição Newsletter',
            html: `<p><strong>Email:</strong> ${email}</p><p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>`
        });
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
