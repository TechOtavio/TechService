import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
})

app.post('/enviar-email', async (req, res) => {
  const { nome, email, empresa, telefone, mensagem } = req.body

  try {
    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `Mensagem de contato - ${empresa || 'Sem empresa'}`,
      html: `
        <h2>Mensagem de contato</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa || ''}</p>
        <p><strong>Telefone:</strong> ${telefone || ''}</p>
        <p><strong>Mensagem:</strong> ${mensagem}</p>
      `
    })

    res.status(200).json({ sucesso: true, mensagem: 'Email enviado com sucesso!' })
  } catch (erro) {
    console.error('Erro ao enviar:', erro)
    res.status(500).json({ sucesso: false, mensagem: `Erro ao enviar e-mail: ${erro.message}` })
  }
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
